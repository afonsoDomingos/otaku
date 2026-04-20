const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../server/.env') });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = async () => {
    try {
        const dsRes = await cloudinary.uploader.upload('C:/Users/MUV/.gemini/antigravity/brain/a990b7a2-6c94-41ab-a4d7-28371e1d1044/demon_slayer_poster_1776668260853.png', { folder: 'otakuzone_animes' });
        console.log('Demon Slayer URL:', dsRes.secure_url);

        const aotRes = await cloudinary.uploader.upload('C:/Users/MUV/.gemini/antigravity/brain/a990b7a2-6c94-41ab-a4d7-28371e1d1044/attack_on_titan_poster_1776668310137.png', { folder: 'otakuzone_animes' });
        console.log('Attack on Titan URL:', aotRes.secure_url);

    } catch (error) {
        console.error(error);
    }
};

upload();
