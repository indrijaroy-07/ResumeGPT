const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET || 'resume-analyzer-dev-secret';

module.exports = function (req, res) {
  const token = req.headers['x-auth-token'] || req.headers['authorization'];
  if (!token) {
    res.status(401).json({ msg: 'No token, authorization denied' });
    return null;
  }

  try {
    const realToken = token.startsWith('Bearer ') ? token.slice(7) : token;
    const decoded = jwt.verify(realToken, jwtSecret);
    return decoded.user;
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
    return null;
  }
};
