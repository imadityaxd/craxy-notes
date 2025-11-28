// client/src/pages/UploadForm.jsx

import React, { useState, useMemo } from 'react'; 
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FileUp, Save, Lock, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// --- CORRECT IMPORT ---
import { FOET_BRANCHES, getSubjects } from '../utils/syllabusData'; 
// ----------------------

// Hardcoded lists for structural simplicity:
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

const API_UPLOAD_URL = 'http://localhost:5000/api/notes/upload';

const UploadForm = () => {
    const { isAuthenticated, isAdminOrContributor, getAuthHeaders, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [courseCode, setCourseCode] = useState('');
    // Default to the first branch in the imported list
    const [branch, setBranch] = useState(FOET_BRANCHES[0].code);
    const [semester, setSemester] = useState(1);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const [statusType, setStatusType] = useState(null); // 'success' or 'error'

    // Memoize the list of subjects based on selected branch and semester
    // This is the CRITICAL integration point with syllabusData.js
    const availableSubjects = useMemo(() => {
        return getSubjects(branch, semester);
    }, [branch, semester]);


    // Redirect unauthenticated users if auth context is loaded
    if (!authLoading && !isAuthenticated) {
        navigate('/');
        return null;
    }

    if (!isAdminOrContributor && isAuthenticated) {
        return (
            <div className="max-w-xl mx-auto mt-20 p-8 bg-red-100 border border-red-400 rounded-xl text-red-800 text-center">
                <Lock className="w-10 h-10 mx-auto mb-4" />
                <h2 className="text-2xl font-bold">Access Denied (403)</h2>
                <p>Your current user role ({useAuth().userRole || 'student'}) does not have permission to upload files.</p>
                <p className="mt-2 text-sm">Contact the site administrator to be promoted to Contributor or Admin.</p>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Ensure that a subject code is selected/provided
        if (!file || !title || !courseCode || !branch || !semester) {
            setMessage('Please fill in all fields (including Subject Code) and select a file.');
            setStatusType('error');
            return;
        }

        setUploading(true);
        setMessage('');
        setStatusType(null);

        // 1. Create FormData object for file/metadata transmission
        const formData = new FormData();
        formData.append('noteFile', file);
        formData.append('title', title);
        formData.append('courseCode', courseCode);
        formData.append('branch', branch);
        formData.append('semester', semester);

        try {
            // 2. Send request with Auth Headers
            const headers = getAuthHeaders();
            headers['Content-Type'] = 'multipart/form-data'; 

            const response = await axios.post(API_UPLOAD_URL, formData, { headers });

            setMessage(`Upload successful! Note ID: ${response.data.noteId}`);
            setStatusType('success');
            
            // Clear form after successful upload
            setFile(null);
            setTitle('');
            setCourseCode('');
            document.getElementById('noteFile').value = ''; 

        } catch (error) {
            console.error('Upload Failed:', error.response || error);
            
            let errMsg = 'An unknown server error occurred.';
            if (error.response) {
                if (error.response.status === 403) {
                    errMsg = "Authorization Failed: Your role is blocked by the server.";
                } else if (error.response.data && error.response.data.message) {
                    errMsg = `Server Error: ${error.response.data.message}`;
                }
            }
            setMessage(errMsg);
            setStatusType('error');
        } finally {
            setUploading(false);
        }
    };

    const statusClasses = statusType === 'success' 
        ? 'bg-green-100 text-green-800 border-green-400' 
        : 'bg-red-100 text-red-800 border-red-400';

    if (authLoading) {
        return <div className="text-center p-8 text-gray-500">Authenticating user...</div>;
    }

    return (
        <div className="max-w-3xl mx-auto mt-10 p-8 bg-white shadow-2xl rounded-xl">
            <h2 className="text-3xl font-extrabold text-blue-800 mb-6 flex items-center space-x-3">
                <FileUp className="w-8 h-8" />
                <span>Upload New FOET Notes</span>
            </h2>

            {message && (
                <div className={`p-4 mb-4 rounded-lg border font-medium ${statusClasses}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* File Input */}
                <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg bg-gray-50">
                    <label htmlFor="noteFile" className="block text-sm font-medium text-gray-700 mb-2">
                        Select Note Document (PDF, DOCX, TXT)
                    </label>
                    <input
                        type="file"
                        id="noteFile"
                        onChange={(e) => setFile(e.target.files[0])}
                        required
                        className="w-full text-gray-900 border-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {file && <p className="mt-2 text-sm text-gray-500">File selected: {file.name}</p>}
                </div>

                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Note Title (e.g., Unit 3 Short Notes: Data Structures)</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="mt-1 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                {/* Branch and Semester Selectors */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="branch" className="block text-sm font-medium text-gray-700">Branch</label>
                        <select
                            id="branch"
                            value={branch}
                            onChange={(e) => {setBranch(e.target.value); setCourseCode('');}} // Reset course code on branch change
                            className="mt-1 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            {FOET_BRANCHES.map(b => (
                                <option key={b.code} value={b.code}>{b.name} ({b.code})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="semester" className="block text-sm font-medium text-gray-700">Semester</label>
                        <select
                            id="semester"
                            value={semester}
                            onChange={(e) => {setSemester(parseInt(e.target.value)); setCourseCode('');}} // Reset course code on semester change
                            className="mt-1 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            {SEMESTERS.map(s => (
                                <option key={s} value={s}>Semester {s}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Course Code Selector (Dynamically loaded) */}
                <div>
                    <label htmlFor="courseCode" className="block text-sm font-medium text-gray-700">Course Code (Auto-filtered List)</label>
                    <select
                        id="courseCode"
                        value={courseCode}
                        onChange={(e) => setCourseCode(e.target.value)}
                        required
                        className="mt-1 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="" disabled>Select a Subject Code...</option>
                        {availableSubjects.map(subject => (
                            <option key={subject.code} value={subject.code}>
                                {subject.code} - {subject.title}
                            </option>
                        ))}
                    </select>
                    {availableSubjects.length === 0 && (
                         <p className="mt-1 text-sm text-red-500">Warning: No detailed syllabus found for this selection. Use XX-000 for custom entry.</p>
                    )}
                </div>
                
                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={uploading}
                    className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 rounded-md font-semibold shadow-lg hover:bg-blue-700 transition duration-300 disabled:bg-gray-400"
                >
                    {uploading ? (
                        <>
                            <span className="animate-spin h-5 w-5 border-t-2 border-white rounded-full"></span>
                            <span>Uploading...</span>
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            <span>Save Note to Portal</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default UploadForm;