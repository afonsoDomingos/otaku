const mongoose = require('mongoose');
const Short = require('./models/Short');
const dotenv = require('dotenv');

dotenv.config();

const initialShorts = [
    { url: 'https://www.youtube.com/shorts/w0YDS5yzPMY', youtubeId: 'w0YDS5yzPMY', title: 'Top Animes da Temporada' },
    { url: 'https://www.youtube.com/shorts/aD4OZR6gVwk', youtubeId: 'aD4OZR6gVwk', title: 'Curiosidades Otaku' },
    { url: 'https://www.youtube.com/shorts/JhZmb8In8W4', youtubeId: 'JhZmb8In8W4', title: 'Novidades Mangá' }
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await Short.deleteMany({});
        await Short.insertMany(initialShorts);
        console.log('Shorts Seeded!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
