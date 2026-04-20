const mongoose = require('mongoose');
const Anime = require('./models/Anime');
const dotenv = require('dotenv');

dotenv.config();

const seedJJK = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const jjk = new Anime({
            title: 'Jujutsu Kaisen',
            description: 'Um jovem entra em uma escola secreta de feiticeiros para livrar o mundo de uma maldição que ele mesmo carrega. Itadori Yuji é um gênio no atletismo, mas não tem interesse em correr em círculos. Ele prefere o Clube de Ocultismo.',
            category: 'Shonen',
            thumbnail: 'https://images.alphacoders.com/131/1310619.jpg',
            seasons: [
                {
                    title: 'Temporada 1',
                    price: 100,
                    episodes: [
                        { title: 'Ryomen Sukuna', videoUrl: 'https://placeholder.com/video' }
                    ]
                }
            ]
        });

        await jjk.save();
        console.log('Jujutsu Kaisen added to catalog!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedJJK();
