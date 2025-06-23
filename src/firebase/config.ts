// src/firebase/config.ts

import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

// Use Vite's import.meta.env syntax and VITE_ prefix
const firebaseConfigString = import.meta.env.VITE_FIREBASE_CONFIG;


// --- THIS IS THE PART YOU ARE ADDING ---
console.log("Reading from .env - VITE_FIREBASE_CONFIG:", firebaseConfigString);

if (!firebaseConfigString) {
  throw new Error("CRITICAL ERROR: VITE_FIREBASE_CONFIG was not found in .env.local. The app cannot start.");
}
// --- END OF THE PART YOU ARE ADDING ---


// This is the "rest of the file" that was already there
const firebaseConfig = JSON.parse(firebaseConfigString);

export const appId = import.meta.env.VITE_APP_ID || 'default-app-id';

// Initialize Firebase
const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);
const functions = getFunctions(firebaseApp);

export { auth, db, storage, functions, firebaseApp };