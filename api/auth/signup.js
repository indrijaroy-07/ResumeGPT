const store = require('../store');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET || 'resume-analyzer-dev-secret';

const normalizeGithubUsername = (github = '') => {
  const value = String(github || '').trim();
  if (!value) return '';

  return value
    .replace(/^@/, '')
    .replace(/^https?:\/\/github\.com\//i, '')
    .replace(/^github\.com\//i, '')
    .replace(/\/+$/, '')
    .split(/[/?#]/)[0]
    .trim();
};

module.exports = async (req, res) => {
  try {
    const { name, email, password, github } = req.body;
    if (!name || !email || !password) return res.status(400).json({ msg: 'Missing fields' });

    const existing = store.users.find(u => u.email === email.toLowerCase());
    if (existing) return res.status(400).json({ msg: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = {
      id: store.genId(),
      name,
      email: email.toLowerCase(),
      password: hashed,
      github: normalizeGithubUsername(github),
      date: new Date()
    };
    store.users.push(user);

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '7d' });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, github: user.github } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
