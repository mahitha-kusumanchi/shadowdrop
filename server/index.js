require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const sequelize = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Initialize Keys
require('./config/keys').initializeKeys();

// Database Sync & Connection
sequelize.sync().then(() => {
    console.log('SQLite Database Connected & Synced');
}).catch(err => {
    console.error('Database Connection Error:', err);
});

// Routes
const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/reports');
const configRoutes = require('./routes/config');

app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/config', configRoutes);

app.get('/', (req, res) => {
    res.send('ShadowDrop API Secured (SQLite)');
});

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Prevent the server from crashing on unhandled errors
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

server.on('error', (error) => {
    console.error('Server Error:', error);
    process.exit(1);
});
