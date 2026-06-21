// server/index.js
const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./db');
const protect = require('./middleware/authMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

// Auth routes (public)
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Chat routes (protected — requires JWT)
const chatRoutes = require('./routes/chat');
app.use('/api/chat', protect, chatRoutes);

// ─── Serve React client in production ───────────────────────────
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

    // Catch-all: send index.html for any non-API route (React Router)
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('Mental Health AI Server is running!');
    });
}

const PORT = process.env.PORT || 5000;

// Connect to MongoDB, then start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});