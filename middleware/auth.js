// middleware/auth.js
const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        req.user = decoded; // contains userId, name, role
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};
