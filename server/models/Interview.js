const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    socialFollowStatus: { type: Boolean, default: false }, // User confirms they follow YT/TikTok
    animeExperience: { type: String, required: true },
    proposedTopics: { type: String, required: true },
    contactWhatsApp: { type: String, required: true },
    paymentProof: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'scheduled', 'rejected'], default: 'pending' },
    scheduledDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);
