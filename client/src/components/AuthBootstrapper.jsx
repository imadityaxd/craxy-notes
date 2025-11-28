// // client/src/components/AuthBootstrapper.jsx

// import React, { useState } from 'react';
// import { createUserWithEmailAndPassword, getIdToken } from 'firebase/auth';
// import { auth } from '../config/firebaseClient'; 

// const AuthBootstrapper = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [status, setStatus] = useState('');

//     const handleSignUp = async () => {
//         setStatus('Signing up and retrieving token...');
//         try {
//             const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//             const user = userCredential.user;
            
//             const token = await getIdToken(user, true); // Force token refresh
            
//             setStatus('SUCCESS! User Signed Up. Check Console (F12) for Keys.');

//             console.log("\n\n--------------------------------------------------");
//             console.log("✅ BOOTSTRAP SUCCESSFUL! (SAVE THESE KEYS)");
//             console.log("1. ADMIN UID (Document ID for /users collection in Firestore):", user.uid);
//             console.log("2. ID TOKEN (For Authorization: Bearer Header):", token);
//             console.log("--------------------------------------------------\n\n");
            
//         } catch (error) {
//             console.error("Sign-up Error:", error.message);
//             setStatus(`Error: ${error.message}`);
//         }
//     };

//     return (
//         <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-lg rounded-lg border border-red-300">
//             <h2 className="text-2xl font-bold text-red-600 mb-4">ADMIN UNLOCK (Bootstrapper)</h2>
//             <p className="text-gray-600 mb-6">
//                 Use this once to create the initial admin account and get the UID needed for manual database seeding.
//             </p>

//             <div className="mb-4">
//                 <input
//                     type="email"
//                     placeholder="Admin Email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 />
//             </div>
//             <div className="mb-6">
//                 <input
//                     type="password"
//                     placeholder="Password (Min 6 chars)"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 />
//             </div>
//             <button 
//                 onClick={handleSignUp} 
//                 disabled={status.includes('Signing')}
//                 className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition duration-150"
//             >
//                 Sign Up & Retrieve Admin Keys
//             </button>
//             <p className={`mt-4 text-sm font-semibold ${status.includes('SUCCESS') ? 'text-green-600' : 'text-red-500'}`}>
//                 Status: {status}
//             </p>
//         </div>
//     );
// };

// export default AuthBootstrapper;