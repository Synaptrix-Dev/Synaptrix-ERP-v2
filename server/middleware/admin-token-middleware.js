const jwt = require('jsonwebtoken');

exports.verifyAdminToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded.isAdmin) {
            return res.status(403).json({ message: 'Access denied. Unauthorized!' });
        }

        req.user = {
            id: decoded.id,
            email: decoded.email,
            fullName: decoded.fullName,
        };
        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        res.status(401).json({ message: 'Token is not valid' });
    }
};
