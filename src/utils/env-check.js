/**
 * Utility to check Firebase configuration 
 * For debugging purposes only
 */

/**
 * Check if Firebase configuration is complete
 * @returns {Object} - Configuration check results
 */
export const checkFirebaseConfig = () => {
  // Get Firebase config from environment variables
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  // Check if any config values are missing
  const missingKeys = Object.keys(firebaseConfig).filter(key => !firebaseConfig[key]);
  
  // Configuration is complete if no keys are missing
  const configComplete = missingKeys.length === 0;
  
  return {
    configComplete,
    firebaseConfig,
    missingKeys
  };
};
