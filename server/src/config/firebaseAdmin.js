// server/src/config/firebaseAdmin.js (CORRECTED CODE)

import admin from 'firebase-admin'; // FIX: Use the default import syntax

if (!admin.apps || !admin.apps.length) { // FIX: Added null/undefined check for 'apps'
    admin.initializeApp({
        // NOTE: In production, service account credentials must be configured here.
        // For local development, if you are not using a service account key file, 
        // you might need to manually pass a placeholder credential, but try this simple fix first.
    });
}

export const authAdmin = admin.auth();
export const dbAdmin = admin.firestore();