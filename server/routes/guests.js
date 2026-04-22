const express = require('express');
const router = express.Router();
const Guest = require('../models/Guest');
const { protect, admin } = require('../middleware/auth');

// Get all guests
router.get('/', async (req, res) => {
    try {
        const guests = await Guest.find({});
        res.json(guests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create guest (Admin)
router.post('/', protect, admin, async (req, res) => {
    try {
        const guest = new Guest(req.body);
        const createdGuest = await guest.save();
        res.status(201).json(createdGuest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update guest (Admin)
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const guest = await Guest.findById(req.params.id);
        if (guest) {
            guest.name = req.body.name || guest.name;
            guest.photo = req.body.photo || guest.photo;
            guest.role = req.body.role || guest.role;
            const updatedGuest = await guest.save();
            res.json(updatedGuest);
        } else {
            res.status(404).json({ message: 'Guest not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete guest (Admin)
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const guest = await Guest.findById(req.params.id);
        if (guest) {
            await Guest.deleteOne({ _id: req.params.id });
            res.json({ message: 'Guest removed' });
        } else {
            res.status(404).json({ message: 'Guest not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
