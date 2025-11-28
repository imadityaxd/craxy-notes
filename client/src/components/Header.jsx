// client/src/components/Header.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import { LogOut, Upload, BookOpen, User, UserCheck } from 'lucide-react'; // Added UserCheck icon
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebaseClient';

const Header = () => {
    // Get all relevant authentication states
    const { currentUser, isAdminOrContributor, userRole, loading } = useAuth(); 

    const handleLogout = () => {
        signOut(auth).catch(console.error);
    };

    // Determine the user's visual role marker
    const getUserRoleClass = (role) => {
        if (role === 'admin') return 'text-yellow-300 font-bold';
        if (role === 'contributor') return 'text-green-300 font-semibold';
        return 'text-blue-200';
    };

    return (
        <header className="bg-gray-800 text-white p-4 shadow-2xl sticky top-0 z-10 border-b-4 border-blue-500">
            <div className="container mx-auto flex justify-between items-center">
                
                {/* Logo / Home Link */}
                <Link to="/notes/CSE/1" className="text-2xl font-extrabold tracking-tight flex items-center space-x-3 transition duration-200 hover:text-blue-300">
                    <BookOpen className="w-6 h-6 text-blue-400" />
                    <span>LU FOET Notes Portal</span>
                </Link>

                {/* Navigation and Actions */}
                <nav className="flex items-center space-x-6">
                    
                    {/* Secured Upload Button (High Visibility) */}
                    {!loading && isAdminOrContributor && (
                        <Link 
                            to="/upload" 
                            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition duration-150 shadow-lg transform hover:scale-105"
                        >
                            <Upload className="w-4 h-4" />
                            <span>Upload Notes</span>
                        </Link>
                    )}

                    {/* Authentication Status & User Info Block */}
                    {!loading && currentUser ? (
                        <div className="flex items-center space-x-3">
                            <div className="text-right">
                                <p className="text-xs font-medium text-gray-300">
                                    {currentUser.email}
                                </p>
                                <p className={`text-xs ${getUserRoleClass(userRole)}`}>
                                    {userRole ? `Role: ${userRole.toUpperCase()}` : 'Student'}
                                </p>
                            </div>
                            <button 
                                onClick={handleLogout} 
                                className="flex items-center space-x-1 text-sm bg-gray-700 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition duration-150 shadow-md"
                                title="Logout"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    ) : (
                        // Login Link
                        <Link 
                            to="/auth-unlock" 
                            className="flex items-center space-x-1 text-sm text-blue-300 hover:text-white transition duration-150"
                        >
                            <User className="w-4 h-4" />
                            <span>Login / Sign Up</span>
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;