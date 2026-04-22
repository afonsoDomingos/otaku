const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    contactEmail: { type: String, required: true },
    proposal: { type: String, required: true },
    status: { type: String, enum: ['pending', 'reviewed', 'accepted', 'rejected'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('PartnerRequest', partnerSchema);
