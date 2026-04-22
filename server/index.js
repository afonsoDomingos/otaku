const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Load env from server directory (for local dev)
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors({ origin: '*' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

let dbError = null;
let isConnected = false;

const connectDB = async () => {
    if (isConnected) return;
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is undefined. Vercel environment variables are missing.");
        }
        await mongoose.connect(process.env.MONGO_URI);
        isConnected = true;
        console.log('Connected to MongoDB Atlas');
    } catch (err) {
        dbError = err.message;
        console.error('MongoDB connection error:', err);
    }
};

// Vercel Serverless requires awaiting connection or middleware
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

// Routes
const apiRouter = express.Router();
apiRouter.use('/auth', require('./routes/auth'));
apiRouter.use('/animes', require('./routes/animes'));
apiRouter.use('/mangas', require('./routes/mangas'));
apiRouter.use('/shorts', require('./routes/shorts'));
apiRouter.use('/purchases', require('./routes/purchases'));
apiRouter.use('/interviews', require('./routes/interviews'));
apiRouter.use('/guests', require('./routes/guests'));
apiRouter.use('/partners', require('./routes/partners'));

apiRouter.get('/ping', (req, res) => res.json({ 
    message: 'Server is alive', 
    dbState: mongoose.connection.readyState,
    dbError: dbError,
    hasMongoUri: !!process.env.MONGO_URI
}));

app.use('/api', apiRouter);
app.use('/', apiRouter);

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
