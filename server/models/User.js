const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    purchasedSeasons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Season' }],
    lastActive: { type: Date, default: Date.now },
    country: { type: String, default: 'Desconhecido' },
    profilePic: { type: String, default: 'https://via.placeholder.com/150' }
}, { timestamps: true });

userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Falha na verificação de senha');
    }
};

module.exports = mongoose.model('User', userSchema);
