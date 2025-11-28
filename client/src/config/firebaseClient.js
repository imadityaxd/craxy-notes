// client/src/config/firebaseClient.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// NOTE: Use environment variables set by your client-side bundler (e.g., Vite/CRA)
// Example: import.meta.env.VITE_FIREBASE_API_KEY
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY, 
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);



// Initialize services we will need
export const auth = getAuth(app);
export const db = getFirestore(app);

//debug step- remember to remove it 
window.auth = auth;