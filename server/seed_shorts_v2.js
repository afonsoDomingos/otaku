const mongoose = require('mongoose');
const Short = require('./models/Short');
const dotenv = require('dotenv');

dotenv.config();

const newShorts = [
    { url: 'https://www.youtube.com/shorts/LMxqaZ8zH08', youtubeId: 'LMxqaZ8zH08', title: 'Curiosidades One Piece' },
    { url: 'https://www.youtube.com/shorts/omhY1l4aw0k', youtubeId: 'omhY1l4aw0k', title: 'Top Lutas Anime' },
    { url: 'https://www.youtube.com/shorts/xhqgPSiS-fc', youtubeId: 'xhqgPSiS-fc', title: 'Mangás Recomendados' },
    { url: 'https://www.youtube.com/shorts/DPi6jbDip38', youtubeId: 'DPi6jbDip38', title: 'Notícias Otaku' }
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        // We add to existing ones
        await Short.insertMany(newShorts);
        console.log('New Shorts Added!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
