const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Purchase = require('../models/Purchase');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');

// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'otakuzone_proofs',
        allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'],
    },
});

const upload = multer({ storage });

// Create Purchase (Upload proof to Cloudinary)
router.post('/', protect, upload.single('proof'), async (req, res) => {
    try {
        const { animeId, seasonId } = req.body;
        const purchase = await Purchase.create({
            user: req.user._id,
            anime: animeId,
            season: seasonId,
            paymentProof: req.file.path, // This will be the Cloudinary URL
            status: 'pending'
        });
        res.status(201).json(purchase);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get User Purchases
router.get('/my-purchases', protect, async (req, res) => {
    try {
        const purchases = await Purchase.find({ user: req.user._id }).populate('anime');
        res.json(purchases);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get All Purchases (Admin)
router.get('/admin', protect, admin, async (req, res) => {
    try {
        const purchases = await Purchase.find({}).populate('user anime');
        res.json(purchases);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Purchase Status (Admin)
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const { status, rejectionReason } = req.body;
        const purchase = await Purchase.findById(req.params.id);
        if (purchase) {
            purchase.status = status;
            if (rejectionReason) purchase.rejectionReason = rejectionReason;
            
            if (status === 'approved') {
                const user = await User.findById(purchase.user);
                // In MongoDB we store Season ID as a string in the purchasedSeasons array
                // but we should check if it's already there
                if (!user.purchasedSeasons.includes(purchase.season)) {
                    user.purchasedSeasons.push(purchase.season);
                    await user.save();
                }
            }
            
            await purchase.save();
            res.json(purchase);
        } else {
            res.status(404).json({ message: 'Purchase not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
