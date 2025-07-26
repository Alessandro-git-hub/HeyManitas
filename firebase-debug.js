// Firebase Configuration Check
// Run this in browser console to debug Firebase setup

import { auth } from './src/utils/firebase.js';

console.log('Firebase Auth instance:', auth);
console.log('Firebase Config:', {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing',
});

console.log('Auth domain:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);
