const mongoose = require('mongoose');

const musicStatsSchema = new mongoose.Schema({
    plays: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MusicStats', musicStatsSchema);
