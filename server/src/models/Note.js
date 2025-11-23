// server/src/models/Note.js
const NoteSchema = {
    title: { type: 'string', required: true },
    courseCode: { type: 'string', required: true },
    branch: { type: 'string', required: true },
    semester: { type: 'number', required: true },
    
    // Cloudinary Data
    fileUrl: { type: 'string', required: true }, 
    publicId: { type: 'string', required: true },
    
    uploadedAt: { type: 'timestamp' },
    uploadedBy: { type: 'string', description: 'User ID' }
};

export default NoteSchema;