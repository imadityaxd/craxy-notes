// client/src/components/NoteCard.jsx

import React from 'react';
// Importing icons used for visual presentation and functionality
import { Download, FileText, Calendar } from 'lucide-react'; 

// Functional component to display a single note item within the subject grid.
// It receives a 'note' object containing metadata (title, fileUrl, uploadedAt, etc.)
const NoteCard = ({ note }) => {
    
    // Helper function to extract the file extension (e.g., PDF, DOCX) from the Cloudinary URL.
    // This logic removes query parameters ('?') if they exist.
    const getFileFormat = (url) => {
        const parts = url.split('.');
        const format = parts[parts.length - 1].split('?')[0];
        return format.toUpperCase();
    };

    // The 'format' variable holds the extracted file type (e.g., "PDF")
    const format = getFileFormat(note.fileUrl);

    return (
        // Main Card Container:
        // - flex flex-col: Ensures content stacks vertically on ALL screen sizes (requested vertical stacking).
        // - justify-start items-start: Aligns content cleanly to the top-left within the vertical stack.
        // - w-full: Essential for making the card fill its assigned grid column space.
        <div className="flex flex-col justify-start items-start 
                        bg-white p-4 rounded-xl transition duration-150 border border-gray-200 shadow-lg 
                        hover:shadow-xl hover:border-blue-300 w-full">
            
            {/* --- 1. Title and Icon Block --- */}
            <div className="flex items-start space-x-3 w-full mb-3 border-b pb-3">
                {/* File Icon: Fixed size and branded color */}
                <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                
                <div className="min-w-0 flex-1">
                    {/* Note Title: Uses break-words to ensure long titles wrap correctly and don't overflow the card */}
                    <p className="font-semibold text-gray-900 leading-snug break-words">
                        {note.title}
                    </p>
                </div>
            </div>
            
            {/* --- 2. Metadata and Download Button Row (Vertical Separation) --- */}
            {/* This section occupies the full width below the title divider */}
            <div className="w-full flex justify-between items-center pt-1">
                
                {/* Metadata (Date Uploaded) */}
                <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>Uploaded: {new Date(note.uploadedAt).toLocaleDateString()}</span>
                </div>

                {/* Download Button */}
                <a 
                    // Direct link to the Cloudinary URL for file download
                    href={note.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    // Styling for download button: green, rounded, and uses flex-shrink-0 
                    // to prevent it from collapsing on small widths.
                    className="flex items-center justify-center space-x-1.5 
                               bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium 
                               shadow-md hover:bg-green-700 transition duration-150 transform hover:scale-[1.02] 
                               flex-shrink-0"
                >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                </a>
            </div>
        </div>
    );
};

export default NoteCard;