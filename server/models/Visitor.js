const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
    ip: String,
    country: { type: String, default: 'Desconhecido' },
    userAgent: String,
    lastActive: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Visitor', visitorSchema);
