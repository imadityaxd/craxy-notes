// server/src/controllers/notesController.js

import { db } from '../config/firebase.js'; 
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';

// Define the mandatory public Firestore collection path
const PUBLIC_NOTES_COLLECTION = '/artifacts/1:109691016066:web:8d14c48c05a2f0859f359b/public/data/foet_notes'; // REPLACE 'appId' with your actual Firebase App ID

// --- FETCH NOTES (GET) ---
export const getNotes = async (req, res) => {
    try {
        const { branch, semester } = req.query; // e.g., ?branch=CSE&semester=3
        let notesQuery = collection(db, PUBLIC_NOTES_COLLECTION);
        
        // Build the query based on parameters
        if (branch) {
            notesQuery = query(notesQuery, where('branch', '==', branch.toUpperCase()));
        }
        if (semester) {
            notesQuery = query(notesQuery, where('semester', '==', parseInt(semester)));
        }

        const snapshot = await getDocs(notesQuery);
        
        const notes = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).json(notes);
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ message: 'Failed to retrieve notes.', error: error.message });
    }
};

// --- UPLOAD/SAVE NOTE METADATA (POST) ---
export const saveNoteMetadata = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        const { title, courseCode, branch, semester } = req.body;
        
        if (!title || !courseCode || !branch || !semester) {
            return res.status(400).json({ message: 'Missing required metadata fields.' });
        }
        
        // Get UID from the authenticated request object
        const uploaderUid = req.user.uid; 

        const newNoteData = {
            title,
            courseCode: courseCode.toUpperCase(),
            branch: branch.toUpperCase(),
            semester: parseInt(semester),
            
            fileUrl: req.file.path, 
            publicId: req.file.filename,
            uploadedAt: new Date().toISOString(),
            uploadedBy: uploaderUid, 
        };

        // Save metadata to Firestore
        const docRef = await addDoc(collection(db, PUBLIC_NOTES_COLLECTION), newNoteData);

        res.status(201).json({ 
            message: 'Note uploaded and metadata saved successfully!',
            noteId: docRef.id,
            fileUrl: newNoteData.fileUrl
        });

    } catch (error) {
        console.error('Error saving note metadata:', error);
        res.status(500).json({ message: 'Failed to save note data.', error: error.message });
    }
};