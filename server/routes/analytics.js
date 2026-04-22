const express = require('express');
const router = express.Router();
const Visitor = require('../models/Visitor');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');

// Public ping for anonymous visitors
router.post('/ping-visitor', async (req, res) => {
    try {
        const { country, ip } = req.body;
        // Simple visitor tracking by IP (upsert)
        if (ip) {
            await Visitor.findOneAndUpdate(
                { ip },
                { country: country || 'Desconhecido', lastActive: new Date(), userAgent: req.headers['user-agent'] },
                { upsert: true, new: true }
            );
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin: Get analytics stats
router.get('/stats', protect, admin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const onlineThreshold = new Date(Date.now() - 10 * 60 * 1000); // 10 minutes
        
        const onlineUsersCount = await User.countDocuments({ lastActive: { $gte: onlineThreshold } });
        const onlineVisitorsCount = await Visitor.countDocuments({ lastActive: { $gte: onlineThreshold } });
        
        // Country stats for users
        const userCountries = await User.aggregate([
            { $group: { _id: "$country", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // Country stats for visitors
        const visitorCountries = await Visitor.aggregate([
            { $group: { _id: "$country", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        res.json({
            totalUsers,
            onlineUsers: onlineUsersCount,
            onlineVisitors: onlineVisitorsCount,
            totalOnline: onlineUsersCount + onlineVisitorsCount,
            userCountries,
            visitorCountries
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
