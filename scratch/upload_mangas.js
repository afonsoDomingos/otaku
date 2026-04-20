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
        const opRes = await cloudinary.uploader.upload('C:/Users/MUV/.gemini/antigravity/brain/a990b7a2-6c94-41ab-a4d7-28371e1d1044/one_piece_manga_cover_1776670680404.png', { folder: 'otakuzone_mangas' });
        console.log('One Piece URL:', opRes.secure_url);

        const slRes = await cloudinary.uploader.upload('C:/Users/MUV/.gemini/antigravity/brain/a990b7a2-6c94-41ab-a4d7-28371e1d1044/solo_leveling_manga_cover_1776671743807.png', { folder: 'otakuzone_mangas' });
        console.log('Solo Leveling URL:', slRes.secure_url);

    } catch (error) {
        console.error(error);
    }
};

upload();
