const express = require('express');
const router = express.Router();
const Parking = require('../models/Parking');
const { protect } = require('../middleware/authMiddleware');
const adminAuth = require('../middleware/adminAuth');
const { Op } = require('sequelize');

// Get all parkings (accessible by all authenticated users)
router.get('/', protect, async (req, res) => {
    try {
        const parkings = await Parking.findAll();
        res.json(parkings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Search parkings by location (accessible by all authenticated users)
router.get('/search', protect, async (req, res) => {
    try {
        const { location } = req.query;
        const parkings = await Parking.findAll({
            where: {
                location: {
                    [Op.iLike]: `%${location}%`
                }
            }
        });
        res.json(parkings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a new parking (admin only)
router.post('/', protect, adminAuth, async (req, res) => {
    try {
        const newParking = await Parking.create({
            code: req.body.code,
            parkingName: req.body.parkingName,
            availableSpaces: req.body.availableSpaces,
            location: req.body.location,
            chargingFeePerHour: req.body.chargingFeePerHour
        });
        res.status(201).json(newParking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a parking (admin only)
router.patch('/:id', protect, adminAuth, async (req, res) => {
    try {
        const parking = await Parking.findByPk(req.params.id);
        if (!parking) {
            return res.status(404).json({ message: 'Parking not found' });
        }

        const { code, parkingName, availableSpaces, location, chargingFeePerHour } = req.body;
        if (code !== undefined) parking.code = code;
        if (parkingName !== undefined) parking.parkingName = parkingName;
        if (availableSpaces !== undefined) parking.availableSpaces = availableSpaces;
        if (location !== undefined) parking.location = location;
        if (chargingFeePerHour !== undefined) parking.chargingFeePerHour = chargingFeePerHour;

        await parking.save();
        res.json(parking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a parking (admin only)
router.delete('/:id', protect, adminAuth, async (req, res) => {
    try {
        const parking = await Parking.findByPk(req.params.id);
        if (!parking) {
            return res.status(404).json({ message: 'Parking not found' });
        }

        await parking.destroy();
        res.json({ message: 'Parking deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 