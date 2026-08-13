const express = require('express');
const router = express.Router();
const multer = require('multer');
const analyzeController = require('../controllers/analyzeController');
const auth = require('../middleware/authMiddleware');

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// @route   POST api/analyze
// @desc    Analyze resume
// @access  Private
router.post('/', auth, upload.single('resume'), analyzeController.analyzeResume);

// @route   GET api/history
// @desc    Get user's analysis history
// @access  Private
router.get('/history', auth, analyzeController.getHistory);

module.exports = router;
