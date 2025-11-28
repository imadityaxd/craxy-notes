// client/src/pages/AuthPage.jsx

import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseClient';
import { useNavigate } from 'react-router-dom';
import { UserPlus, LogIn, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; 

const AuthPage = () => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    // Redirect already authenticated users to the homepage
    if (isAuthenticated) {
        navigate('/notes/CSE/1');
        return null;
    }

    const handleAuth = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            if (isLoginMode) {
                // SIGN IN
                await signInWithEmailAndPassword(auth, email, password);
                
                // If successful, navigate home (or upload form if desired)
                navigate('/notes/CSE/1'); 

            } else {
                // SIGN UP
                await createUserWithEmailAndPassword(auth, email, password);
                
                // CRITICAL NOTE: The user is now created in Firebase Auth.
                // The /users document with the role='student' (default) or role='admin' (manual seed) 
                // must exist in Firestore for the security check to work.
                
                navigate('/notes/CSE/1'); 
            }
        } catch (err) {
            console.error("Authentication Error:", err.message);
            
            let message;
            if (isLoginMode) {
                message = "Login failed. Check your email/password or sign up.";
            } else if (err.code === 'auth/weak-password') {
                message = "Password is too weak. Must be 6 characters or more.";
            } else if (err.code === 'auth/email-already-in-use') {
                message = "Account already exists. Please log in.";
            } else {
                message = err.message || "An unknown error occurred.";
            }
            setError(message);

        } finally {
            setIsLoading(false);
        }
    };

    const title = isLoginMode ? 'Sign In to Portal' : 'Create Student Account';
    const buttonText = isLoginMode ? 'Login' : 'Sign Up';
    const icon = isLoginMode ? <LogIn className="w-5 h-5 mr-2" /> : <UserPlus className="w-5 h-5 mr-2" />;

    return (
        <div className="max-w-md mx-auto mt-16 p-8 bg-white shadow-2xl rounded-xl">
            <h2 className="text-3xl font-extrabold text-blue-800 mb-6 flex items-center justify-center">
                {title}
            </h2>

            {error && (
                <div className="flex items-center p-3 mb-4 bg-red-100 text-red-700 border border-red-400 rounded-md">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email (LU Account)</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="user@lkouniv.ac.in"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Minimum 6 characters"
                    />
                </div>
                
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center bg-blue-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition duration-300 disabled:bg-gray-400"
                >
                    {isLoading ? 'Processing...' : icon && buttonText}
                </button>
            </form>

            <div className="mt-6 text-center">
                <button
                    type="button"
                    onClick={() => setIsLoginMode(!isLoginMode)}
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition duration-150"
                >
                    {isLoginMode ? 'Need an account? Sign Up' : 'Already have an account? Login'}
                </button>
            </div>
        </div>
    );
};

export default AuthPage;