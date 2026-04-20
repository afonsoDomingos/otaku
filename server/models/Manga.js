const mongoose = require('mongoose');

const mangaSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true },
    author: { type: String },
    genre: { type: String },
    price: { type: Number, default: 0 },
    chapters: [
        {
            number: { type: Number, required: true },
            title: { type: String },
            pages: [{ type: String }] // Links for images or PDF
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Manga', mangaSchema);
