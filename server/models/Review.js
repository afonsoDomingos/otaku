const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    name: { type: String, default: 'Anónimo' },
    anime: { type: String, default: 'Geral' },
    comment: { type: String, required: true },
    status: { type: String, enum: ['approved', 'pending', 'rejected'], default: 'approved' } // Auto-approved for now, can be moderated later
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
