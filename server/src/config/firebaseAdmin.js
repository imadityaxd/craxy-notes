// server/src/config/firebaseAdmin.js

import admin from 'firebase-admin';
import 'dotenv/config'; 
// --- REMOVED: fs, path, fileURLToPath as we are not reading local files. ---

// TEMPORARY LOCAL FALLBACK REMOVED. CODE NOW RELIES ONLY ON process.env.

if (!admin.apps || !admin.apps.length) {
    
    // CRITICAL: Load the entire JSON content from the environment variable named SERVICE_ACCOUNT_KEY_FILE
    const serviceAccountJsonString = process.env.SERVICE_ACCOUNT_KEY_FILE;
    
    if (!serviceAccountJsonString) {
        // If the variable is missing (as it would be on a local dev machine without it set),
        // we throw this error, forcing the developer to set it securely in the production environment.
        throw new Error("FATAL: SERVICE_ACCOUNT_KEY_FILE is missing from environment variables. Cannot initialize Firebase Admin.");
    }
    
    let credentials;
    let serviceAccountJson;
    
    try {
        // Parse the JSON string retrieved from the environment variable
        serviceAccountJson = JSON.parse(serviceAccountJsonString);
        
        // Use the parsed JSON object to create a Firebase Admin credential object
        credentials = admin.credential.cert(serviceAccountJson);
        
    } catch (error) {
        // Log the specific parsing error message for debugging
        console.error(`\n🚨 FATAL ERROR during JSON parsing: ${error.message}`);
        // Re-throw a clear error to the console
        throw new Error("Credentials Parsing Failed. Ensure the SERVICE_ACCOUNT_KEY_FILE environment variable contains valid, non-escaped JSON.");
    }

    // Since the project ID is available directly in the JSON, use that for initialization.
    const projectIdFromKey = serviceAccountJson.project_id; 

    admin.initializeApp({
        // FIX: Explicitly pass the credential created from the environment variable
        credential: credentials,
        projectId: projectIdFromKey, // Set projectId directly from the loaded key content
    });
}

export const authAdmin = admin.auth();
export const dbAdmin = admin.firestore();