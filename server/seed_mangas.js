const mongoose = require('mongoose');
const Manga = require('./models/Manga');
const dotenv = require('dotenv');

dotenv.config();

const mangas = [
    {
        title: "One Piece",
        description: "Segue as aventuras de Monkey D. Luffy, um jovem que ganha propriedades de borracha depois de comer acidentalmente uma Fruta do Diabo.",
        thumbnail: "https://res.cloudinary.com/dnvnftvky/image/upload/v1776671826/otakuzone_mangas/m2a7x9f007wfs5w4im8h.jpg",
        author: "Eiichiro Oda",
        genre: "Shonen",
        price: 150,
        chapters: [
            { number: 1, title: "Romance Dawn", pages: [] }
        ]
    },
    {
        title: "Solo Leveling",
        description: "Em um mundo onde caçadores, humanos que possuem habilidades mágicas, devem lutar contra monstros mortais para proteger a humanidade.",
        thumbnail: "https://res.cloudinary.com/dnvnftvky/image/upload/v1776671827/otakuzone_mangas/qvubsvajmge9ehjdshyt.jpg",
        author: "Chugong",
        genre: "Ação/Fantasia",
        price: 200,
        chapters: [
            { number: 1, title: "A Dungeon reaparece", pages: [] }
        ]
    }
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB Atlas for Manga Seed');

        await Manga.deleteMany({});
        await Manga.insertMany(mangas);
        console.log('Manga Database Seeded!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
