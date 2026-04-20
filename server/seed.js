const mongoose = require('mongoose');
const Anime = require('./models/Anime');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const animes = [
    {
        title: "Demon Slayer: Kimetsu no Yaiba",
        description: "Tanjiro Kamado, a young boy who becomes a demon slayer after his family is slaughtered and his younger sister Nezuko is turned into a demon.",
        thumbnail: "https://www.themoviedb.org/t/p/original/xMBRSYbe6v9BC9STInE899pIu8M.jpg",
        category: "Ação",
        seasons: [
            {
                title: "Temporada 1: Tanjiro Kamado, Unwavering Resolve Arc",
                price: 250,
                episodes: [
                    { title: "Cruelty", videoUrl: "https://www.youtube.com/embed/VQGCKyvz9_0" },
                    { title: "Trainer Sakonji Urokodaki", videoUrl: "https://www.youtube.com/embed/VQGCKyvz9_0" }
                ]
            }
        ]
    },
    {
        title: "Attack on Titan",
        description: "After his hometown is destroyed and his mother is killed, young Eren Jaeger vows to cleanse the earth of the giant humanoid Titans.",
        thumbnail: "https://www.themoviedb.org/t/p/original/8C7q82uS8n2D7M2u9LSwCq9S8sw.jpg",
        category: "Drama",
        seasons: [
            {
                title: "Temporada 1",
                price: 400,
                episodes: [
                    { title: "To You, in 2000 Years", videoUrl: "https://www.youtube.com/embed/MGRm4IzK1SQ" }
                ]
            }
        ]
    }
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB Atlas');

        // Create Admin User
        await User.deleteMany({ role: 'admin' });
        
        const adminUser = {
            name: 'Super Admin',
            email: 'admin@otakuzoneflix.com',
            password: '@Admin123@',
            role: 'admin'
        };
        
        await User.create(adminUser);
        console.log('Admin User Created: admin@otakuzoneflix.com');

        await Anime.deleteMany({});
        await Anime.insertMany(animes);
        console.log('Database Seeded!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
