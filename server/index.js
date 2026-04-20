const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
const apiRouter = express.Router();
apiRouter.use('/auth', require('./routes/auth'));
apiRouter.use('/animes', require('./routes/animes'));
apiRouter.use('/mangas', require('./routes/mangas'));
apiRouter.use('/purchases', require('./routes/purchases'));

app.use('/api', apiRouter);
app.use('/', apiRouter); // Fallback for Vercel rewriting behavior

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
