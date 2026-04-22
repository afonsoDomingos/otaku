const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { protect, admin } = require('../middleware/auth');

// Public route to get all approved reviews
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find({ status: 'approved' }).sort({ createdAt: -1 }).limit(20);
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Public route to submit a review
router.post('/', async (req, res) => {
    try {
        const review = new Review({
            name: req.body.name || 'Anónimo',
            anime: req.body.anime || 'Geral',
            comment: req.body.comment
        });
        const createdReview = await review.save();
        res.status(201).json(createdReview);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Admin route to get all reviews (including pending/rejected)
router.get('/admin', protect, admin, async (req, res) => {
    try {
        const reviews = await Review.find({}).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin route to delete a review
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (review) {
            await Review.deleteOne({ _id: req.params.id });
            res.json({ message: 'Opinião removida' });
        } else {
            res.status(404).json({ message: 'Opinião não encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
