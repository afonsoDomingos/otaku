const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Load env from server directory (for local dev)
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Cache DB connection for serverless environment
let isConnected = false;
const connectDB = async () => {
    if (isConnected) return;
    try {
        await mongoose.connect(process.env.MONGO_URI);
        isConnected = true;
        console.log('Connected to MongoDB Atlas');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
};
connectDB();

// Routes
const apiRouter = express.Router();
apiRouter.use('/auth', require('./routes/auth'));
apiRouter.use('/animes', require('./routes/animes'));
apiRouter.use('/mangas', require('./routes/mangas'));
apiRouter.use('/shorts', require('./routes/shorts'));
apiRouter.use('/purchases', require('./routes/purchases'));
apiRouter.use('/interviews', require('./routes/interviews'));
apiRouter.get('/ping', (req, res) => res.json({ message: 'Server is alive', db: mongoose.connection.readyState }));

app.use('/api', apiRouter);
app.use('/', apiRouter);

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
