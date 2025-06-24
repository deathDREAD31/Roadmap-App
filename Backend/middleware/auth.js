const jwt = require('jsonwebtoken');
const { findByEmail } = require('../services/user-service');

async function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, 'jwt_secret');
    const user = await findByEmail(decoded.username);
    if (!user) return res.status(404).json({ error: 'User not found' });

    req.user = user;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
}

module.exports = authenticateToken;
