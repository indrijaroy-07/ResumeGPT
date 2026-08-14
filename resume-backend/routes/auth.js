const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

// @route   POST api/auth/signup
// @desc    Register user
// @access  Public
router.post('/signup', authController.signup);

// @route   POST api/auth/signin
// @desc    Authenticate user & get token
// @access  Public
router.post('/signin', authController.signin);

// @route   PUT api/auth/github
// @desc    Update a user's GitHub handle
// @access  Private
router.put('/github', auth, authController.updateGithub);

module.exports = router;
