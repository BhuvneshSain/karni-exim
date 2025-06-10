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
} catch (error) {
  console.error("Error reading .env file:", error.message);
  console.log("Please make sure you have a .env file with Firebase config values");
  process.exit(1);
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Main function
async function updateReviewsFlags() {
  console.log("Checking for reviews without proper flags...");
  
  try {
    // Get all reviews
    const reviewsSnapshot = await getDocs(collection(db, "reviews"));
    
    if (reviewsSnapshot.empty) {
      console.log("No reviews found in the database.");
      process.exit(0);
    }
    
    console.log(`Found ${reviewsSnapshot.size} reviews in the database.`);
    
    const batch = writeBatch(db);
    let updatedCount = 0;
    let timestampFixCount = 0;
    
    // Process each review
    reviewsSnapshot.forEach((reviewDoc) => {
      const reviewData = reviewDoc.data();
      const reviewRef = doc(db, "reviews", reviewDoc.id);
      let needsUpdate = false;
      const updates = {};
      
      // Check for missing isAdmin flag
      if (reviewData.isAdmin === undefined) {
        updates.isAdmin = true;
        needsUpdate = true;
      }
      
      // Check for missing approved flag
      if (reviewData.approved === undefined) {
        updates.approved = true;
        needsUpdate = true;
      }
      
      // Check for invalid createdAt timestamp
      if (!reviewData.createdAt || 
          !(reviewData.createdAt instanceof Timestamp) ||
          typeof reviewData.createdAt === 'string') {
        
        // Create a new timestamp for reviews without a valid createdAt
        updates.createdAt = Timestamp.now();
        timestampFixCount++;
        needsUpdate = true;
      }
      
      // Apply updates if needed
      if (needsUpdate) {
        batch.update(reviewRef, updates);
        updatedCount++;
      }
    });
    
    // Commit all updates
    if (updatedCount > 0) {
      await batch.commit();
      console.log(`✅ Successfully updated ${updatedCount} reviews.`);
      if (timestampFixCount > 0) {
        console.log(`   - Fixed timestamps for ${timestampFixCount} reviews.`);
      }
    } else {
      console.log("✅ All reviews already have proper flags and timestamps.");
    }
    
  } catch (error) {
    console.error("❌ Error updating reviews:", error.message);
    process.exit(1);
  }
}

// Run the main function
updateReviewsFlags();
