const express = require('express');
const router = express.Router();
const Interview = require('../models/Interview');
const { verifyToken, isAdmin } = require('../middleware/auth');
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });

// Submit new interview request
router.post('/', verifyToken, upload.single('proof'), async (req, res) => {
    try {
        const { animeExperience, proposedTopics, contactWhatsApp } = req.body;
        const interview = new Interview({
            user: req.user.id,
            animeExperience,
            proposedTopics,
            contactWhatsApp,
            paymentProof: req.file.path
        });
        await interview.save();
        res.status(201).json(interview);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin: Get all requests
router.get('/admin', verifyToken, isAdmin, async (req, res) => {
    try {
        const interviews = await Interview.find().populate('user', 'name email').sort('-createdAt');
        res.json(interviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin: Update status
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const { status, scheduledDate } = req.body;
        const interview = await Interview.findByIdAndUpdate(req.params.id, { status, scheduledDate }, { new: true });
        res.json(interview);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
