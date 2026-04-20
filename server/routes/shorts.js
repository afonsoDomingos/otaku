const express = require('express');
const router = express.Router();
const Short = require('../models/Short');
const { protect, admin } = require('../middleware/auth');

// Helper to extract YouTube ID from shorts link
const getYoutubeId = (url) => {
    const regExp = /^.*(shorts\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

// Get all shorts
router.get('/', async (req, res) => {
    try {
        const shorts = await Short.find({}).sort({ createdAt: -1 });
        res.json(shorts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create short (Admin)
router.post('/', protect, admin, async (req, res) => {
    try {
        const { url, title } = req.body;
        const youtubeId = getYoutubeId(url);
        if (!youtubeId) return res.status(400).json({ message: 'URL de Shorts inválida' });

        const short = new Short({ url, title, youtubeId });
        await short.save();
        res.status(201).json(short);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete short (Admin)
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        await Short.findByIdAndDelete(req.params.id);
        res.json({ message: 'Short removido' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
