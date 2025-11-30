// client/src/hooks/useFetchNotes.js

import { useState, useEffect } from 'react';
import axios from 'axios';
// We don't need useAuth for public reads, but keep it for reference if we secure the GET later
// import { useAuth } from '../context/AuthContext'; 

// NOTE: Use the correct server URL for your environment
const API_BASE_URL = 'https://craxy-notes-backend.onrender.com/api/notes'; //change this when the backend is live from localhost to that platform link

const useFetchNotes = (branch, semester) => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNotes = async () => {
            setLoading(true);
            setError(null);
            
            // Build query parameters based on current selections
            const queryParams = new URLSearchParams();
            if (branch) {
                queryParams.append('branch', branch);
            }
            if (semester) {
                queryParams.append('semester', semester);
            }

            const url = `${API_BASE_URL}?${queryParams.toString()}`;

            try {
                // Since this is a public GET request, we don't need the Auth token headers
                const response = await axios.get(url);
                
                // Group notes by subject for better display
                const groupedNotes = response.data.reduce((acc, note) => {
                    const key = note.courseCode;
                    if (!acc[key]) {
                        acc[key] = {
                            courseCode: note.courseCode,
                            title: note.title.split(":")[0].trim(), // Use part of title as main subject name
                            items: []
                        };
                    }
                    acc[key].items.push(note);
                    return acc;
                }, {});

                setNotes(Object.values(groupedNotes));
            } catch (err) {
                console.error("API Fetch Error:", err);
                setError('Failed to fetch notes. Check server connection or API endpoint.');
            } finally {
                setLoading(false);
            }
        };

        // Only fetch if either branch or semester is set (prevents huge initial load)
        if (branch || semester) {
            fetchNotes();
        } else {
            setLoading(false);
            setNotes([]);
        }
    }, [branch, semester]); // Re-run effect whenever filters change

    return { notes, loading, error };
};

export default useFetchNotes;