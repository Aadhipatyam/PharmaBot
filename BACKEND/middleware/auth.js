const jwt = require('jsonwebtoken');

// Use the secret from .env or fallback
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id: user._id }
    next();
  } catch (err) {
    console.error('JWT error:', err.message);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
