/**
 * Prerender Configuration for Karni Exim
 * Generates static HTML for product pages to improve SEO
 * This is used by Netlify's prerendering service
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyClUG-ZXpH7KMrIWQXKfRNZcuOpkYDtQ-M",
  authDomain: "karni-exim.firebaseapp.com",
  projectId: "karni-exim",
  storageBucket: "karni-exim.firebasestorage.app",
  messagingSenderId: "929893887316",
  appId: "1:929893887316:web:40f6ee89e84b02cfd20cfb",
  measurementId: "G-QV03L2SKMP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Get all product URLs for prerendering
 */
async function getPrerenderRoutes() {
  try {
    const productsSnapshot = await getDocs(collection(db, 'products'));
    const productIds = productsSnapshot.docs.map(doc => doc.id);
    
    // Static routes
    const staticRoutes = [
      '/',
      '/products',
      '/about',
      '/contact',
      '/privacy-policy',
      '/terms-of-service',
    ];
    
    // Product routes
    const productRoutes = productIds.map(id => `/product/${id}`);
    
    // Category routes
    const categories = [...new Set(
      productsSnapshot.docs
        .map(doc => doc.data().category)
        .filter(Boolean)
    )];
    const categoryRoutes = categories.map(cat => `/products?category=${encodeURIComponent(cat)}`);
    
    return [
      ...staticRoutes,
      ...productRoutes,
      ...categoryRoutes
    ];
  } catch (error) {
    console.error('Error fetching routes:', error);
    return [
      '/',
      '/products',
      '/about',
      '/contact',
    ];
  }
}

export default getPrerenderRoutes;
