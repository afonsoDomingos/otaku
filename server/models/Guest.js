const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
    name: { type: String, required: true },
    photo: { type: String, default: 'https://via.placeholder.com/150' },
    role: { type: String, default: 'Convidado Especial' }
}, { timestamps: true });

module.exports = mongoose.model('Guest', guestSchema);
