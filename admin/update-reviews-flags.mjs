// This script sets isAdmin and approved flags, and fixes createdAt timestamps for all reviews
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc, writeBatch, Timestamp } from 'firebase/firestore';
import fs from 'fs';

console.log("Review Data Repair Tool");
console.log("=======================");

// Read Firebase config from .env file
let firebaseConfig = {};
try {
  const envFileContent = fs.readFileSync('.env', 'utf8');
  const envLines = envFileContent.split('\n');
  
  envLines.forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
  
  // Firebase configuration from environment variables
  firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
  };
  
  // Check if config is valid
  const missingKeys = Object.keys(firebaseConfig).filter(key => !firebaseConfig[key]);
  if (missingKeys.length > 0) {
    console.error(`Missing Firebase configuration keys: ${missingKeys.join(', ')}`);
    console.error('Please check your .env file');
    process.exit(1);
  }
  
} catch (error) {
  console.error('Error reading .env file:', error.message);
  console.error('Please make sure you have a .env file in the project root with Firebase configuration');
  process.exit(1);
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function updateAllReviews() {
  try {
    console.log("Starting to update all reviews...");
    
    // Get all reviews
    const reviewsSnapshot = await getDocs(collection(db, "reviews"));
    
    if (reviewsSnapshot.empty) {
      console.log("No reviews found in the database.");
      return;
    }
    
    console.log(`Found ${reviewsSnapshot.size} reviews to update.`);
    
    // Use batch write for efficiency
    const batch = writeBatch(db);
    let updateCount = 0;    reviewsSnapshot.forEach(docSnapshot => {
      const reviewData = docSnapshot.data();
      const reviewRef = doc(db, "reviews", docSnapshot.id);
      
      // Prepare update object
      const updates = {};
      let needsUpdate = false;
      
      // Check if either flag is missing or false
      if (reviewData.isAdmin !== true) {
        updates.isAdmin = true;
        needsUpdate = true;
      }
      
      if (reviewData.approved !== true) {
        updates.approved = true;
        needsUpdate = true;
      }
      
      // Check if createdAt is missing or invalid
      if (!reviewData.createdAt) {
        updates.createdAt = Timestamp.now();
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        batch.update(reviewRef, updates);
        updateCount++;
      }
    });
      // Only commit if there are updates to make
    if (updateCount > 0) {
      await batch.commit();
      console.log(`Successfully updated ${updateCount} reviews.`);
      console.log("All reviews are now properly configured with required flags and timestamps.");
    } else {
      console.log("No updates needed. All reviews are already properly configured.");
    }
    
    // Verify the state after updates
    const verifySnapshot = await getDocs(collection(db, "reviews"));
    const validReviews = [];
    
    verifySnapshot.forEach(doc => {
      const data = doc.data();
      if (data.isAdmin === true && data.approved === true && data.createdAt) {
        validReviews.push(doc.id);
      }
    });
    
    console.log(`\nVerification complete: ${validReviews.length}/${verifySnapshot.size} reviews are now valid for display.`);
    
    if (validReviews.length === 0) {
      console.log("\nWARNING: No valid reviews found even after updates!");
      console.log("Consider creating new reviews through the admin panel.");
    } else if (validReviews.length < verifySnapshot.size) {
      console.log("\nWARNING: Some reviews are still invalid. Run the script again to fix all issues.");
    } else {
      console.log("\nSUCCESS: All reviews are now valid and should display correctly on the website.");
    }
    
  } catch (error) {
    console.error("Error updating reviews:", error);
    console.log("\nTROUBLESHOOTING STEPS:");
    console.log("1. Ensure your .env file contains all required Firebase configuration values");
    console.log("2. Check your Firestore database permissions");
    console.log("3. Try running the script with administrator privileges");
  }
}

updateAllReviews();
