const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    try {
        // Get token from cookie or Authorization header
        let token = req.cookies.token;
        
        // Check Authorization header if no cookie
        const authHeader = req.headers['authorization'];
        if (!token && authHeader) {
            token = authHeader.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = {
    authenticateToken
}; 