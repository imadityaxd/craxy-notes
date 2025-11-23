// server/src/middleware/authMiddleware.js

import { authAdmin } from '../config/firebaseAdmin.js';

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authorization token required.' });
    }

    try {
        const decodedToken = await authAdmin.verifyIdToken(token);
        req.user = decodedToken; // Attach user data (e.g., req.user.uid)
        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
};

export default authMiddleware;