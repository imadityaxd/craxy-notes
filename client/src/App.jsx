// client/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Import the Auth Provider

// Import Pages/Components
import AuthBootstrapper from './components/AuthBootstrapper'; 
import NoteBrowser from './pages/NoteBrowser'; 
import UploadForm from './pages/UploadForm'; 
import Header from './components/Header'; // Placeholder for site navigation

function App() {
  return (
    <AuthProvider> {/* Wrap the whole app with the Auth Provider */}
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header /> {/* Will show navigation bar */}
          <main className="container mx-auto p-4">
            <Routes>
              {/* 1. INITIAL UNLOCK ROUTE (Temporary Root) */}
              <Route path="/" element={<AuthBootstrapper />} /> 

              {/* 2. BROWSING NOTES (Public Access) */}
              <Route path="/notes/:branch/:semester" element={<NoteBrowser />} /> 
              
              {/* 3. SECURED UPLOAD ROUTE (Requires Auth & Admin/Contributor Role) */}
              <Route path="/upload" element={<UploadForm />} /> 

              {/* 4. Fallback */}
              <Route path="*" element={<h1>404: Page Not Found</h1>} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;