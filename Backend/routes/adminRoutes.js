const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const adminAuth = require('../middleware/adminAuth');

// Get all users (admin only)
router.get('/users', protect, adminAuth, async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update user role to admin (admin only)
router.patch('/users/:id/make-admin', protect, adminAuth, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = 'admin';
        const updatedUser = await user.save();
        res.json({ message: 'User role updated to admin', user: updatedUser });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Remove admin role (admin only)
router.patch('/users/:id/remove-admin', protect, adminAuth, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = 'user';
        const updatedUser = await user.save();
        res.json({ message: 'Admin role removed', user: updatedUser });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
