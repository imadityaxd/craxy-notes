// server/src/routes/notesRoutes.js

import express from 'express';
import multer from 'multer';

import { saveNoteMetadata, getNotes } from '../controllers/notesController.js'; 
import cloudinaryStorage from '../config/cloudinaryConfig.js';
import authMiddleware from '../middleware/authMiddleware.js'; 
import roleMiddleware from '../middleware/roleMiddleware.js'; 

const router = express.Router();
const upload = multer({ storage: cloudinaryStorage });

// Define the roles that are ALLOWED to upload notes
const uploaderRoles = ['admin', 'contributor']; 

// GET /api/notes (Public Access)
router.get('/', getNotes);

// POST /api/notes/upload (Secured Access)
router.post(
    '/upload', 
    authMiddleware,                 // 1. Verify token
    roleMiddleware(uploaderRoles),  // 2. Check for 'admin' or 'contributor' role
    upload.single('noteFile'),      // 3. Handle file upload to Cloudinary
    saveNoteMetadata                // 4. Save metadata to Firestore
);

export default router;