// This script verifies all reviews in the database to ensure they're properly structured
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import fs from 'fs';

console.log("Review Verification Tool");
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

// Helper to check if review has all required fields
function validateReview(review) {
  const requiredFields = ['name', 'text', 'rating', 'approved', 'isAdmin', 'createdAt'];
  const missingFields = [];
  
  requiredFields.forEach(field => {
    if (review[field] === undefined) {
      missingFields.push(field);
    }
  });
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
}

// Main function
async function verifyReviews() {
  console.log("Verifying reviews...");
  
  try {
    // Query for all reviews
    const reviewsSnapshot = await getDocs(collection(db, "reviews"));
    
    if (reviewsSnapshot.empty) {
      console.log("No reviews found in the database.");
      process.exit(0);
    }
    
    console.log(`Found ${reviewsSnapshot.size} total reviews in the database.`);
    
    // Query for the reviews that should appear in the ticker
    const tickerQuery = query(
      collection(db, "reviews"),
      where("approved", "==", true),
      where("isAdmin", "==", true)
    );
    
    const tickerReviewsSnapshot = await getDocs(tickerQuery);
    console.log(`Found ${tickerReviewsSnapshot.size} reviews eligible for display in the ticker.`);
    
    // Validate each review
    let validCount = 0;
    let invalidCount = 0;
    
    reviewsSnapshot.forEach((reviewDoc) => {
      const reviewData = reviewDoc.data();
      const validation = validateReview(reviewData);
      
      if (validation.isValid) {
        validCount++;
      } else {
        invalidCount++;
        console.log(`\n❌ Review ID ${reviewDoc.id} is missing fields: ${validation.missingFields.join(', ')}`);
      }
    });
    
    console.log("\n----- Summary -----");
    console.log(`Total reviews: ${reviewsSnapshot.size}`);
    console.log(`Valid reviews: ${validCount}`);
    console.log(`Invalid reviews: ${invalidCount}`);
    
    if (invalidCount > 0) {
      console.log("\nTo fix invalid reviews, run: npm run fix-reviews");
    } else {
      console.log("\n✅ All reviews have the required fields!");
    }
    
  } catch (error) {
    console.error("❌ Error verifying reviews:", error.message);
    process.exit(1);
  }
}

// Run the main function
verifyReviews();
