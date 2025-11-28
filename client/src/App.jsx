// client/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Import Navigate
import { AuthProvider } from './context/AuthContext'; 

// Import Pages/Components
import AuthPage from './pages/AuthPage.jsx'; 
import NoteBrowser from './pages/NoteBrowser'; 
import UploadForm from './pages/UploadForm'; 
import Header from './components/Header'; 

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header /> 
          <main className="container mx-auto p-4">
            <Routes>
              
              {/* 1. DEFAULT ROUTE: Redirects to a specific view (e.g., CSE Semester 1) or the main browser */}
              {/* Changed: Root path now redirects to the general Notes Browser page */}
              <Route path="/" element={<Navigate to="/notes/CSE/1" replace />} /> 

              {/* 2. BROWSING NOTES (Public Access) - This is the new primary homepage content */}
              {/* Uses optional parameters for flexibility in linking */}
              <Route path="/notes/:branch/:semester" element={<NoteBrowser />} /> 
              
              {/* 3. SECURED UPLOAD ROUTE (Requires Auth & Admin/Contributor Role) */}
              <Route path="/upload" element={<UploadForm />} /> 

              {/* 4. UTILITY ROUTE: Keep the bootstrapper accessible via a specific URL for debugging/new users */}
              <Route path="/auth-unlock" element={<AuthPage />} /> 

              {/* 5. Fallback */}
              <Route path="*" element={<h1>404: Page Not Found</h1>} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;