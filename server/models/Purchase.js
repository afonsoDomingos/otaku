const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    anime: { type: mongoose.Schema.Types.ObjectId, ref: 'Anime', required: true },
    season: { type: mongoose.Schema.Types.ObjectId, required: true }, // ID of the season within the anime
    paymentProof: { type: String, required: true }, // File path or URL
    price: { type: Number, default: 0 },
    status: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected'], 
        default: 'pending' 
    },
    rejectionReason: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Purchase', purchaseSchema);
