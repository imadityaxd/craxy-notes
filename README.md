📚 LU FOET Notes Portal

Project Overview

The LU FOET Notes Portal is a secure, full-stack web application designed to centralize and organize study materials for students of the Faculty of Engineering & Technology (FOET) at Lucknow University.

The portal allows students to browse notes filtered precisely by Branch (e.g., CSE, ECE) and Semester (1 through 8). Crucially, it implements a role-based security system to ensure only authorized contributors can upload files.

Key Features

Hierarchical Navigation: Notes are filtered based on the official FOET syllabus structure.

Role-Based Access Control (RBAC): Uses Firebase Authentication and custom Firestore roles (admin, contributor) to restrict file uploads.

Secure File Storage: Documents (PDF, DOCX) are stored on Cloudinary for scalability and fast global delivery.

Responsive Design: Optimized for seamless browsing on mobile, tablet, and desktop devices (mobile-first approach).

Functional Search: Allows users to filter notes within a selected subject or semester.

🛠️ Technology Stack

This project utilizes a modern, serverless-friendly technology stack:

Frontend (M): React with Vite

Styling: Tailwind CSS (for utility-first, responsive design)

Backend (E/N): Express.js and Node.js (using ES Modules - ESM)

Database (F): Cloud Firestore (for metadata and user roles)

File Storage (C): Cloudinary (for secure, scalable document storage and delivery)

Authentication (A): Firebase Authentication (via the client and Admin SDK)

📁 Project Structure

The project follows a standard monorepo structure separating the client and server:

foet-notes-portal/
├── client/          # React Frontend (Vite)
│   ├── src/
│   │   ├── components/  # Reusable UI elements (Header, NoteCard)
│   │   ├── pages/       # Views (NoteBrowser, UploadForm, AuthPage)
│   │   ├── context/     # Global state (AuthContext)
│   │   └── utils/       # Syllabus data map
├── server/          # Node.js/Express API (Secure Backend)
│   ├── src/
│   │   ├── config/      # Firebase, Cloudinary initialization
│   │   ├── controllers/ # API logic (getNotes, saveNoteMetadata)
│   │   ├── middleware/  # Auth & Role verification (authMiddleware)
│   │   └── routes/      # API Endpoints
├── .env             # Global environment variables
└── README.md


⚙️ Setup and Installation

Follow these steps to set up the project locally:

Prerequisites

Node.js (v18+)

npm (v8+)

A Firebase Project with Authentication (Email/Password) and Cloud Firestore enabled.

A Cloudinary Account (for file storage credentials).

Service Account JSON Key for the Firebase Admin SDK.

1. Backend Setup

Navigate to the server directory: cd server

Install dependencies: npm install

Create a .env file in the /server directory and populate it with the following credentials:

# Server configuration
PORT=5000 
FIREBASE_PROJECT_ID=your-project-id 

# Cloudinary Credentials
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CRITICAL: Service Account Credentials (Single-line, unescaped JSON)
SERVICE_ACCOUNT_KEY_FILE={"type": "service_account", "project_id": "...", "private_key": "..."}


Start the server:

npm run dev 


2. Frontend Setup

Navigate to the client directory: cd ../client

Install dependencies: npm install (includes axios, react-router-dom, tailwindcss)

Create a .env file in the /client directory and populate it with the Vite-prefixed public Firebase keys:

VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_APP_ID=...


Start the client server:

npm run dev


🔑 Authentication and Admin Bootstrapping

The system defaults all new sign-ups to the 'student' role (read-only). To gain upload access:

Sign Up: Run the client and navigate to the Login/Sign Up page (/auth-unlock) to create your account.

Get UID: Retrieve your unique User ID (UID) from the browser console after signing up.

Seed Role (Manual): Go to your Firestore Console in the browser, navigate to the users collection, and manually create a document with your UID as the Document ID, and the field role set to "admin".

This action unlocks the secure upload route (/upload) for your account.

🚀 Deployment Notes (Render)

1. Backend Deployment (Render API)

CORS: Ensure the server/index.js file explicitly lists your live frontend URL (https://craxy-notes-frontend.onrender.com) in the allowedOrigins array.

Environment Variables: All secrets (SERVICE_ACCOUNT_KEY_FILE, Cloudinary keys) must be transferred to the Render Environment Variables panel.

2. Frontend Deployment (Render Static Site)

Routing Fallback (CRITICAL): Configure a Rewrite Rule on your Render Static Site service to handle React Router's client-side routing. This directs all unmatched traffic to the main index.html file.

Source: /*

Destination: /index.html

Type: Rewrite

👤 Contribution

This project was built to provide accurate and easy access to study materials for FOET students.
