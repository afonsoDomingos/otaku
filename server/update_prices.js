const mongoose = require('mongoose');
const Anime = require('./models/Anime');
const Manga = require('./models/Manga');
const dotenv = require('dotenv');

dotenv.config();

const updatePrices = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // Update Animes: 100 MT per season
        const animes = await Anime.find();
        for (let anime of animes) {
            anime.seasons = anime.seasons.map(s => ({ ...s, price: 100 }));
            await anime.save();
        }
        console.log(`Updated ${animes.length} animes to 100 MT per season`);

        // Update Mangas: 25 MT
        const mangaUpdate = await Manga.updateMany({}, { $set: { price: 25 } });
        console.log(`Updated ${mangaUpdate.modifiedCount} mangas to 25 MT`);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

updatePrices();
