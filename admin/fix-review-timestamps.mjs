// This script helps diagnose issues with the createdAt field in reviews
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc, writeBatch, Timestamp } from 'firebase/firestore';
import fs from 'fs';

// Read Firebase config from .env file
console.log("Review Timestamp Diagnostics Tool");
console.log("===============================");

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

async function fixReviewTimestamps() {
  try {
    console.log("Starting review timestamp diagnostics...");
    
    // Get all reviews
    const reviewsSnapshot = await getDocs(collection(db, "reviews"));
    
    if (reviewsSnapshot.empty) {
      console.log("No reviews found in the database.");
      return;
    }
    
    console.log(`Found ${reviewsSnapshot.size} reviews to check.`);
    
    let needsTimestampFix = 0;
    let hasTimestamp = 0;
    let needsFlagFix = 0;
    let allGood = 0;
    
    // Use batch write for efficiency
    const batch = writeBatch(db);
    
    reviewsSnapshot.forEach(docSnapshot => {
      const reviewData = docSnapshot.data();
      const reviewRef = doc(db, "reviews", docSnapshot.id);
      let updateNeeded = false;
      let updates = {};
      
      // Check for missing/invalid createdAt
      if (!reviewData.createdAt) {
        updates.createdAt = Timestamp.now();
        updateNeeded = true;
        needsTimestampFix++;
      } else {
        hasTimestamp++;
      }
      
      // Check for missing flags
      if (reviewData.isAdmin !== true || reviewData.approved !== true) {
        updates.isAdmin = true;
        updates.approved = true;
        updateNeeded = true;
        needsFlagFix++;
      } else if (!updateNeeded) {
        allGood++;
      }
      
      if (updateNeeded) {
        batch.update(reviewRef, updates);
      }
    });
    
    console.log("\nReview Status Summary:");
    console.log(`- Total reviews: ${reviewsSnapshot.size}`);
    console.log(`- Reviews with valid timestamp: ${hasTimestamp}`);
    console.log(`- Reviews missing timestamp: ${needsTimestampFix}`);
    console.log(`- Reviews missing correct flags: ${needsFlagFix}`);
    console.log(`- Reviews with all required fields: ${allGood}`);
    
    // Only commit if there are updates to make
    if (needsTimestampFix > 0 || needsFlagFix > 0) {
      console.log("\nApplying fixes...");
      await batch.commit();
      console.log(`Successfully updated ${needsTimestampFix + needsFlagFix} reviews.`);
    } else {
      console.log("\nNo fixes needed. All reviews have proper timestamps and flags.");
    }
    
    console.log("\nPossible issues preventing reviews from displaying:");
    if (reviewsSnapshot.size === 0) {
      console.log("- No reviews exist in the database. Add reviews through the admin panel.");
    } else if (allGood === 0) {
      console.log("- No reviews have both proper timestamps AND correct flags.");
    } else if (allGood > 0 && needsTimestampFix + needsFlagFix > 0) {
      console.log(`- ${allGood} reviews should be displaying. Fixes have been applied to ${needsTimestampFix + needsFlagFix} other reviews.`);
    } else {
      console.log(`- All ${allGood} reviews appear correctly configured, but may not be displaying due to other issues.`);
      console.log("- Check the browser console for errors when loading the homepage.");
      console.log("- Verify that the ReviewsTicker component is being correctly imported and rendered.");
    }
    
  } catch (error) {
    console.error("Error diagnosing reviews:", error);
  }
}

fixReviewTimestamps();
