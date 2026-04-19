const mongoose = require('mongoose');

const seasonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    episodes: [{
        title: { type: String, required: true },
        videoUrl: { type: String, required: true }, // URL to video or external link
        duration: { type: String }
    }]
});

const animeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true }, // Image URL
    category: { type: String, default: 'Action' },
    seasons: [seasonSchema]
}, { timestamps: true });

module.exports = mongoose.model('Anime', animeSchema);
module.exports.Season = mongoose.model('Season', seasonSchema);
