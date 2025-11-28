import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/index.css'; 
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* CRITICAL: Wrap the entire application in the AuthProvider */}
    <AuthProvider>
        <App />
    </AuthProvider>
  </React.StrictMode>,
);