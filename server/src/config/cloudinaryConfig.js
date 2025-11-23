// server/src/config/cloudinaryConfig.js

import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// 1. Configure Cloudinary with Credentials from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// 2. Define the Cloudinary Storage Engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'FOET_Notes', 
    resource_type: 'raw', 
    allowed_formats: ['pdf', 'doc', 'docx', 'txt'],
    public_id: (req, file) => {
      const { branch = 'UNKNOWN', semester = '0' } = req.body;
      const fileName = file.originalname.replace(/\.\w+$/, '').substring(0, 30);
      return `${branch.toUpperCase()}/${semester}/${fileName}`;
    },
  },
});

export default storage;