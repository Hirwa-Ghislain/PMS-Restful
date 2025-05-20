const express = require('express');
const router = express.Router();
const RegisterCar = require('../models/RegisterCar');
const Parking = require('../models/Parking');
const { protect } = require('../middleware/authMiddleware');
const adminAuth = require('../middleware/adminAuth');
const Bill = require('../models/Bill');

// Get all registrations for a user
router.get('/user', protect, async (req, res) => {
    try {
        const registrations = await RegisterCar.findAll({
            where: { userId: req.user.id },
            include: [
                { association: 'parking', attributes: ['parkingName', 'location'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(registrations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all registrations (admin only)
router.get('/admin', protect, adminAuth, async (req, res) => {
    try {
        const registrations = await RegisterCar.findAll({
            include: [
                { association: 'user', attributes: ['fullName', 'email'] },
                { association: 'parking', attributes: ['parkingName', 'location'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(registrations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new car registration (user)
router.post('/', protect, async (req, res) => {
    try {
        // Validate required fields
        if (!req.body.plateNumber || !req.body.parkingCode) {
            return res.status(400).json({ 
                message: 'Plate number and parking code are required' 
            });
        }

        // Check if parking code exists
        const parking = await Parking.findOne({
            where: { code: req.body.parkingCode }
        });

        if (!parking) {
            return res.status(400).json({ 
                message: 'Parking code not available' 
            });
        }

        const newRegistration = await RegisterCar.create({
            userId: req.user.id,
            plateNumber: req.body.plateNumber,
            parkingCode: req.body.parkingCode,
            entryDateTime: req.body.entryDateTime || new Date(),
            status: 'ingoing',
            exitDateTime: null,
            chargedAmount: 0
        });
        res.status(201).json(newRegistration);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update registration (user can only update plate number and parking code if ticketStatus is false)
router.patch('/:id', protect, async (req, res) => {
    try {
        const registration = await RegisterCar.findOne({
            where: { 
                id: req.params.id, 
                userId: req.user.id,
                ticketStatus: false
            }
        });

        if (!registration) {
            return res.status(404).json({ 
                message: 'Registration not found or cannot be updated' 
            });
        }

        // If parking code is being updated, check if it exists
        if (req.body.parkingCode) {
            const parking = await Parking.findOne({
                where: { code: req.body.parkingCode }
            });

            if (!parking) {
                return res.status(400).json({ 
                    message: 'Parking code not available' 
                });
            }
        }

        const { plateNumber, parkingCode } = req.body;
        if (plateNumber) registration.plateNumber = plateNumber;
        if (parkingCode) registration.parkingCode = parkingCode;

        await registration.save();
        res.json(registration);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update ticket status (admin only)
router.patch('/:id/ticket-status', protect, adminAuth, async (req, res) => {
    try {
        const registration = await RegisterCar.findOne({
            where: { id: req.params.id },
            include: [
                { association: 'parking', attributes: ['availableSpaces'] }
            ]
        });

        if (!registration) {
            return res.status(404).json({ message: 'Registration not found' });
        }

        // Get count of active registrations for this parking
        const activeRegistrations = await RegisterCar.count({
            where: { 
                parkingCode: registration.parkingCode,
                status: 'ingoing',
                ticketStatus: true
            }
        });

        // Check if parking is full
        if (activeRegistrations >= registration.parking.availableSpaces) {
            return res.status(400).json({ 
                message: 'Parking is full' 
            });
        }

        // Assign slot (A1, A2, etc.)
        const slotNumber = activeRegistrations + 1;
        const slot = `A${slotNumber}`;

        registration.ticketStatus = true;
        registration.slot = slot;
        await registration.save();

        res.json(registration);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Process car exit (user can only process their own car)
router.patch('/:id/exit', protect, async (req, res) => {
    try {
        const registration = await RegisterCar.findOne({
            where: { 
                id: req.params.id,
                userId: req.user.id,
                status: 'ingoing', // Only allow exit if status is ingoing
                ticketStatus: true // Only allow exit if ticket has been generated
            },
            include: [
                { association: 'parking', attributes: ['chargingFeePerHour'] }
            ]
        });

        if (!registration) {
            return res.status(404).json({ 
                message: 'Registration not found or cannot be processed for exit. Make sure the car is in ingoing status and ticket has been generated.' 
            });
        }

        // Calculate duration in hours
        const exitTime = new Date();
        const entryTime = new Date(registration.entryDateTime);
        const durationInMs = exitTime - entryTime;
        const durationInHours = durationInMs / (1000 * 60 * 60);

        // Calculate charged amount
        const chargedAmount = durationInHours * registration.parking.chargingFeePerHour;

        registration.exitDateTime = exitTime;
        registration.status = 'outgoing';
        registration.chargedAmount = chargedAmount;
        await registration.save();
        res.json(registration);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete registration (user can only delete their own)
router.delete('/:id', protect, async (req, res) => {
    try {
        const registration = await RegisterCar.findOne({
            where: { id: req.params.id, userId: req.user.id }
        });
        if (!registration) {
            return res.status(404).json({ message: 'Registration not found' });
        }
        await registration.destroy();
        res.json({ message: 'Registration deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get ticket details (user)
router.get('/:id/ticket', protect, async (req, res) => {
    try {
        const registration = await RegisterCar.findOne({
            where: { 
                id: req.params.id,
                userId: req.user.id,
                ticketStatus: true
            },
            include: [
                { 
                    association: 'parking',
                    attributes: ['parkingName', 'location', 'chargingFeePerHour']
                }
            ]
        });

        if (!registration) {
            return res.status(404).json({ 
                message: 'Ticket not found' 
            });
        }

        res.json(registration);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all outgoing cars (admin only)
router.get('/admin/outgoing', protect, adminAuth, async (req, res) => {
    try {
        const registrations = await RegisterCar.findAll({
            where: { status: 'outgoing' },
            include: [
                { association: 'user', attributes: ['fullName', 'email'] },
                { association: 'parking', attributes: ['parkingName', 'location'] }
            ],
            order: [['exitDateTime', 'DESC']]
        });
        res.json(registrations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Generate bill (admin only)
router.post('/:id/generate-bill', protect, adminAuth, async (req, res) => {
    try {
        const registration = await RegisterCar.findOne({
            where: { 
                id: req.params.id,
                status: 'outgoing'
            },
            include: [
                { association: 'parking', attributes: ['chargingFeePerHour'] }
            ]
        });

        if (!registration) {
            return res.status(404).json({ 
                message: 'Registration not found or not eligible for billing' 
            });
        }

        // Check if bill already exists
        const existingBill = await Bill.findOne({
            where: { registrationId: registration.id }
        });

        if (existingBill) {
            return res.status(400).json({ 
                message: 'Bill already generated for this registration' 
            });
        }

        // Calculate duration in hours
        const exitTime = new Date(registration.exitDateTime);
        const entryTime = new Date(registration.entryDateTime);
        const durationInMs = exitTime - entryTime;
        const durationInHours = durationInMs / (1000 * 60 * 60);

        // Create bill
        const bill = await Bill.create({
            registrationId: registration.id,
            entryDateTime: registration.entryDateTime,
            exitDateTime: registration.exitDateTime,
            duration: durationInHours,
            amount: registration.chargedAmount
        });

        res.status(201).json(bill);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get user's bills
router.get('/user/bills', protect, async (req, res) => {
    try {
        const bills = await Bill.findAll({
            include: [
                {
                    association: 'registration',
                    where: { userId: req.user.id },
                    attributes: ['plateNumber', 'slot'],
                    include: [
                        {
                            association: 'parking',
                            attributes: ['parkingName', 'location']
                        }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json(bills);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Pay bill
router.patch('/bills/:id/pay', protect, async (req, res) => {
    try {
        const bill = await Bill.findOne({
            include: [
                {
                    association: 'registration',
                    where: { userId: req.user.id }
                }
            ]
        });

        if (!bill) {
            return res.status(404).json({ 
                message: 'Bill not found or not associated with your account' 
            });
        }

        if (bill.status === 'paid') {
            return res.status(400).json({ 
                message: 'Bill has already been paid' 
            });
        }

        bill.status = 'paid';
        await bill.save();

        res.json({
            message: 'Bill paid successfully',
            bill
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 