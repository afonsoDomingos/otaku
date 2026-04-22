const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Anime = require('../models/Anime');
const { protect, admin } = require('../middleware/auth');

// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => ({
        folder: 'otakuzone_animes',
        resource_type: file.mimetype.startsWith('video') ? 'video' : 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'mp4', 'mkv', 'avi', 'mov', 'webm'],
    }),
});

// 500MB limit for videos
const upload = multer({ 
    storage,
    limits: { fileSize: 500 * 1024 * 1024 }
});

// Get all animes
router.get('/', async (req, res) => {
    try {
        const animes = await Anime.find({});
        res.json(animes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ⚠️ IMPORTANT: /upload MUST come BEFORE /:id to avoid Express routing conflict
// Upload Video/Image to Cloudinary
router.post('/upload', protect, admin, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Nenhum ficheiro recebido.' });
        }
        res.json({ 
            url: req.file.path,
            public_id: req.file.filename,
            resource_type: req.file.mimetype?.startsWith('video') ? 'video' : 'image'
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: `Erro no upload: ${error.message}` });
    }
});

// Get single anime
router.get('/:id', async (req, res) => {
    try {
        const anime = await Anime.findById(req.params.id);
        if (anime) res.json(anime);
        else res.status(404).json({ message: 'Anime not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create anime (Admin)
router.post('/', protect, admin, async (req, res) => {
    try {
        const anime = new Anime(req.body);
        const createdAnime = await anime.save();
        res.status(201).json(createdAnime);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update anime (Admin)
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const anime = await Anime.findById(req.params.id);
        if (anime) {
            Object.assign(anime, req.body);
            const updatedAnime = await anime.save();
            res.json(updatedAnime);
        } else {
            res.status(404).json({ message: 'Anime not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete anime (Admin)
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const anime = await Anime.findById(req.params.id);
        if (anime) {
            await Anime.deleteOne({ _id: req.params.id });
            res.json({ message: 'Anime removed' });
        } else {
            res.status(404).json({ message: 'Anime not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
