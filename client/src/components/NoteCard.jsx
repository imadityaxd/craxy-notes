// client/src/components/NoteCard.jsx

import React from 'react';
import { Download, FileText } from 'lucide-react'; // Example icons

const NoteCard = ({ note }) => {
    
    const getFileFormat = (url) => {
        const parts = url.split('.');
        const format = parts[parts.length - 1].split('?')[0];
        return format.toUpperCase();
    };

    //const format = getFileFormat(note.fileUrl);

    return (
        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition duration-150 border-l-4 border-green-500">
            
            {/* Title and Metadata */}
            <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6 text-green-600" />
                <div>
                    <p className="font-semibold text-gray-800">{note.title}</p>
                    <p className="text-xs text-gray-500">
                        Uploaded: {new Date(note.uploadedAt).toLocaleDateString()}
                    </p>
                </div>
            </div>
            
            {/* Download Button */}
            <a 
                href={note.fileUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md hover:bg-green-600 transition duration-150"
            >
                <Download className="w-4 h-4" />
                <span>Download ({/*format*/})</span>
            </a>
        </div>
    );
};

export default NoteCard;