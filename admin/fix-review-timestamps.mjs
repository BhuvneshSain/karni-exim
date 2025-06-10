// This script diagnoses and fixes timestamp issues in review entries
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc, Timestamp } from 'firebase/firestore';
import fs from 'fs';

console.log("Review Timestamp Diagnosis Tool");
console.log("===============================");

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

// Helper to pretty print timestamp data
function formatTimestamp(timestamp) {
  if (!timestamp) return "undefined";
  
  if (timestamp instanceof Timestamp) {
    const date = timestamp.toDate();
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()} [valid Timestamp]`;
  }
  
  if (typeof timestamp === 'object' && timestamp.seconds) {
    return `${new Date(timestamp.seconds * 1000).toISOString()} [server timestamp]`;
  }
  
  if (typeof timestamp === 'string') {
    return `${timestamp} [string: INVALID]`;
  }
  
  return `${timestamp} [${typeof timestamp}: INVALID]`;
}

// Main function
async function diagnoseReviewTimestamps() {
  console.log("Analyzing review timestamps...");
  
  try {
    // Get all reviews
    const reviewsSnapshot = await getDocs(collection(db, "reviews"));
    
    if (reviewsSnapshot.empty) {
      console.log("No reviews found in the database.");
      process.exit(0);
    }
    
    console.log(`Found ${reviewsSnapshot.size} reviews in the database.`);
    
    let validTimestamps = 0;
    let invalidTimestamps = 0;
    
    // Process each review
    reviewsSnapshot.forEach((reviewDoc) => {
      const review = reviewDoc.data();
      const createdAt = review.createdAt;
      
      console.log(`\nReview ID: ${reviewDoc.id}`);
      console.log(`Name: ${review.name}`);
      console.log(`createdAt: ${formatTimestamp(createdAt)}`);
      
      if (!createdAt || 
          !(createdAt instanceof Timestamp) || 
          typeof createdAt === 'string') {
        invalidTimestamps++;
        console.log("Status: ❌ Invalid timestamp");
      } else {
        validTimestamps++;
        console.log("Status: ✅ Valid timestamp");
      }
    });
    
    console.log("\n----- Summary -----");
    console.log(`Total reviews: ${reviewsSnapshot.size}`);
    console.log(`Valid timestamps: ${validTimestamps}`);
    console.log(`Invalid timestamps: ${invalidTimestamps}`);
    
    if (invalidTimestamps > 0) {
      console.log("\nTo fix invalid timestamps, run: npm run fix-reviews");
    } else {
      console.log("\n✅ All timestamps are valid!");
    }
    
  } catch (error) {
    console.error("❌ Error analyzing reviews:", error.message);
    process.exit(1);
  }
}

// Run the main function
diagnoseReviewTimestamps();
