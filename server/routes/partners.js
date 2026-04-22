const express = require('express');
const router = express.Router();
const PartnerRequest = require('../models/PartnerRequest');
const { protect, admin } = require('../middleware/auth');

// Public route to submit a partner request
router.post('/submit', async (req, res) => {
    try {
        const request = new PartnerRequest(req.body);
        const createdRequest = await request.save();
        res.status(201).json({ message: 'Proposta enviada com sucesso!', data: createdRequest });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Admin route to get all partner requests
router.get('/admin', protect, admin, async (req, res) => {
    try {
        const requests = await PartnerRequest.find({}).sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin route to update request status or delete
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const request = await PartnerRequest.findById(req.params.id);
        if (request) {
            await PartnerRequest.deleteOne({ _id: req.params.id });
            res.json({ message: 'Proposta removida' });
        } else {
            res.status(404).json({ message: 'Proposta não encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
