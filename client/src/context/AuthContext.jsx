// client/src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../config/firebaseClient';
import { onAuthStateChanged, getIdToken } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [idToken, setIdToken] = useState(null); // The token needed for secured API calls

    useEffect(() => {
        // This listener is called whenever the user logs in, logs out, or the token refreshes
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const token = await getIdToken(user);
                setIdToken(token);
            } else {
                setIdToken(null);
            }
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe; // Cleanup subscription on unmount
    }, []);

    const value = {
        currentUser,
        idToken,
        loading,
        // Add signIn, signUp, signOut functions here if needed
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};