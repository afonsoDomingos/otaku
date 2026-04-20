const mongoose = require('mongoose');
const Anime = require('./models/Anime');
const dotenv = require('dotenv');

dotenv.config();

const updateJJKImage = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const updated = await Anime.findOneAndUpdate(
            { title: 'Jujutsu Kaisen' },
            { thumbnail: 'https://m.media-amazon.com/images/M/MV5BN2ZkYmE2MDctYmQ4OS00NWI3LWI3NjUtM2VlM2RkZGFhMWY2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg' },
            { new: true }
        );

        if (updated) {
            console.log('Jujutsu Kaisen thumbnail updated successfully!');
        } else {
            console.log('Anime not found in database.');
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

updateJJKImage();
