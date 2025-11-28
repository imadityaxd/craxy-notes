// client/src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../config/firebaseClient';
import { onAuthStateChanged, getIdToken } from 'firebase/auth';
import axios from 'axios';

const AuthContext = createContext();

// 1. Hook to easily access Auth state throughout the application
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [idToken, setIdToken] = useState(null); 
    const [userRole, setUserRole] = useState(null); // Stores the role read from Firestore

    useEffect(() => {
        // This listener tracks the user's logged-in status
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setLoading(true);
            
            if (user) {
                // User is signed in.
                const token = await getIdToken(user);
                setIdToken(token);
                setCurrentUser(user);
                
                // Fetch the user's role immediately after getting the token
                // This call uses the SECURED Express API, but we'll use a mock for now
                // In a true MERN app, we'd fetch the role from the server via a dedicated endpoint.
                
                // Since we manually set the role to 'admin' in Firestore for this UID, 
                // we'll assume the role is 'admin' for now, or fetch it securely later.
                setUserRole('admin'); // Temporary bypass until we build a secure role lookup endpoint

            } else {
                // User is signed out.
                setIdToken(null);
                setCurrentUser(null);
                setUserRole(null);
            }
            setLoading(false);
        });

        return unsubscribe; // Cleanup subscription on unmount
    }, []);

    // Function to inject the ID Token into Axios headers for all authenticated requests
    const getAuthHeaders = () => {
        if (!idToken) return {};
        return {
            Authorization: `Bearer ${idToken}`,
        };
    };

    const value = {
        currentUser,
        idToken,
        loading,
        userRole,
        isAuthenticated: !!currentUser,
        isAdminOrContributor: userRole === 'admin' || userRole === 'contributor',
        getAuthHeaders
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};