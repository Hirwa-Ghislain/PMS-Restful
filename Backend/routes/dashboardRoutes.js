const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Get user profile
router.get('/profile', protect, async (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
