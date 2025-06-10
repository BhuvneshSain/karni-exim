// Check if environment variables are properly loaded
console.log('Environment Variables Check');
console.log('========================');

// Check Vite environment variables
const envVars = import.meta.env || {};
const firebaseKeys = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

console.log('Firebase environment variables:');
let allKeysPresent = true;
firebaseKeys.forEach(key => {
  const value = envVars[key];
  const status = value ? '✓ Present' : '✗ Missing';
  console.log(`${key}: ${status}`);
  if (!value) allKeysPresent = false;
});

if (!allKeysPresent) {
  console.error('\nSome Firebase environment variables are missing!');
  console.error('Make sure you have a .env file in your project root with all required variables.');
} else {
  console.log('\nAll Firebase environment variables are present.');
}

// Export a function to check if Firebase config is valid
export function checkFirebaseConfig() {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };
  
  const configComplete = Object.values(firebaseConfig).every(value => !!value);
  return {
    configComplete,
    firebaseConfig
  };
}
