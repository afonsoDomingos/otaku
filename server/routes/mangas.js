const express = require('express');
const router = express.Router();
const Manga = require('../models/Manga');
const { protect, admin } = require('../middleware/auth');

// Get all mangas
router.get('/', async (req, res) => {
    try {
        const mangas = await Manga.find({});
        res.json(mangas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single manga
router.get('/:id', async (req, res) => {
    try {
        const manga = await Manga.findById(req.params.id);
        if (manga) res.json(manga);
        else res.status(404).json({ message: 'Manga not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create manga (Admin)
router.post('/', protect, admin, async (req, res) => {
    try {
        const manga = new Manga(req.body);
        const createdManga = await manga.save();
        res.status(201).json(createdManga);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update manga (Admin)
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const manga = await Manga.findById(req.params.id);
        if (manga) {
            Object.assign(manga, req.body);
            const updatedManga = await manga.save();
            res.json(updatedManga);
        } else {
            res.status(404).json({ message: 'Manga not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete manga (Admin)
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const manga = await Manga.findById(req.params.id);
        if (manga) {
            await Manga.deleteOne({ _id: req.params.id });
            res.json({ message: 'Manga removed' });
        } else {
            res.status(404).json({ message: 'Manga not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
