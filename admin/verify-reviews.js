// This script helps verify that reviews are properly configured
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

// Load environment variables from .env file
try {
  const envFileContent = fs.readFileSync('.env', 'utf8');
  const envLines = envFileContent.split('\n');
  
  envLines.forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
} catch (error) {
  console.error('Error loading .env file:', error.message);
  console.error('Please make sure you have a .env file in the project root with Firebase configuration');
  process.exit(1);
}

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

async function verifyReviews() {
  try {
    console.log('Verifying reviews configuration...');
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    const reviewsSnapshot = await getDocs(collection(db, 'reviews'));
    
    if (reviewsSnapshot.empty) {
      console.log('No reviews found in the database. You need to add reviews through the admin panel.');
      return;
    }
    
    const reviews = [];
    let adminApprovedCount = 0;
    let adminCount = 0;
    let approvedCount = 0;
    let needsFixCount = 0;
    
    reviewsSnapshot.forEach(doc => {
      const review = { id: doc.id, ...doc.data() };
      reviews.push(review);
      
      if (review.isAdmin === true && review.approved === true) {
        adminApprovedCount++;
      } else if (review.isAdmin === true) {
        adminCount++;
      } else if (review.approved === true) {
        approvedCount++;
      } else {
        needsFixCount++;
      }
    });
    
    console.log(`Total reviews in database: ${reviews.length}`);
    console.log(`Reviews with both flags (isAdmin=true & approved=true): ${adminApprovedCount}`);
    console.log(`Reviews with only isAdmin=true: ${adminCount}`);
    console.log(`Reviews with only approved=true: ${approvedCount}`);
    console.log(`Reviews with neither flag set: ${needsFixCount}`);
    
    console.log('\nREVIEWS VISIBLE ON WEBSITE:');
    if (adminApprovedCount > 0) {
      const visibleReviews = reviews.filter(r => r.isAdmin === true && r.approved === true);
      visibleReviews.forEach(review => {
        console.log(`- ${review.name}: "${review.text.substring(0, 50)}${review.text.length > 50 ? '...' : ''}"`);
      });
    } else {
      console.log('No reviews are currently visible on the website.');
      console.log('To make reviews visible, use the update-reviews-flags.mjs script or the admin panel.');
    }
    
  } catch (error) {
    console.error('Error verifying reviews:', error);
  }
}

verifyReviews();
