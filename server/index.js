// server/index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./db');
const protect = require('./middleware/authMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Mental Health AI Server is running!');
});

// Auth routes (public)
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Chat routes (protected — requires JWT)
const chatRoutes = require('./routes/chat');
app.use('/api/chat', protect, chatRoutes);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB, then start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});