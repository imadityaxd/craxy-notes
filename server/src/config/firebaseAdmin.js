// server/src/config/firebaseAdmin.js (FINAL ROBUST CODE)

import admin from 'firebase-admin';
import 'dotenv/config'; 
import fs from 'fs'; // Import File System module
import path from 'path';
import { fileURLToPath } from 'url';

// --- ESM Path Resolution ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// ---------------------------

if (!admin.apps || !admin.apps.length) {
    
    // CRITICAL: Define the exact filename from your screenshot
    const SERVICE_ACCOUNT_KEY_FILE = 'notes1-4d2cb-firebase-adminsdk-fbsvc-226feca038.json'; // <--- PASTE THE FULL FILENAME HERE
    const serviceAccountPath = path.resolve(__dirname, SERVICE_ACCOUNT_KEY_FILE);

    let credentials;
    
    try {
        // Read the JSON file synchronously and parse it
        const serviceAccountJson = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
        
        // Use the parsed JSON to create a Firebase Admin credential object
        credentials = admin.credential.cert(serviceAccountJson);
        
    } catch (error) {
        console.error(`\n🚨 FATAL ERROR: Cannot read credentials file: ${error.message}`);
        throw new Error("Credentials Load Failed. Check JSON file name and existence.");
    }

    admin.initializeApp({
        // FIX: Explicitly pass the credential to prove server identity
        credential: credentials,
        projectId: process.env.FIREBASE_PROJECT_ID, // Still good practice to include
    });
}

export const authAdmin = admin.auth();
export const dbAdmin = admin.firestore();