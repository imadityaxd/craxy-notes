// server/src/middleware/roleMiddleware.js

import { dbAdmin } from '../config/firebaseAdmin.js';

const roleMiddleware = (allowedRoles) => {
    return async (req, res, next) => {
        const userId = req.user.uid; 
        
        try {
            // Fetch the user's custom role from the private Firestore 'users' collection
            const userDoc = await dbAdmin.collection('users').doc(userId).get();

            if (!userDoc.exists) {
                // If user doesn't exist in the users collection, treat them as 'student'
                if (allowedRoles.includes('student')) return next();
                return res.status(403).json({ message: 'Access denied. User role not defined.' });
            }

            const userRole = userDoc.data().role || 'student';

            if (allowedRoles.includes(userRole)) {
                next(); 
            } else {
                res.status(403).json({ message: `Access denied. Role: ${userRole}. Only ${allowedRoles.join(', ')} can upload.` });
            }
        } catch (error) {
            console.error('Role authorization error:', error);
            res.status(500).json({ message: 'Authorization check failed.' });
        }
    };
};

export default roleMiddleware;