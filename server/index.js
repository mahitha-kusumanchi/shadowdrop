require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const sequelize = require('./config/database');
const User = require('./models/User');
const argon2 = require('argon2');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS — allow local dev + deployed Vercel frontend
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.CLIENT_URL,   // e.g. https://shadowdrop.vercel.app
].filter(Boolean);

// Middleware
app.use(helmet());
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (curl, Postman, server-to-server)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS blocked for origin: ${origin}`));
        }
    },
    credentials: true
}));
app.use(express.json());

// Initialize Keys
require('./config/keys').initializeKeys();

// Database Sync & Connection — then auto-seed superadmin if DB is empty
sequelize.sync().then(async () => {
    console.log('SQLite Database Connected & Synced');

    // Auto-seed superadmin on first run (e.g. fresh Render deployment)
    const count = await User.count();
    if (count === 0) {
        const username = process.env.ADMIN_USERNAME || 'superadmin';
        const password = process.env.ADMIN_PASSWORD || 'Admin@1234';
        const hashed = await argon2.hash(password);
        await User.create({ username, password: hashed, role: 'SuperAdmin', mfaEnabled: false });
        console.log(`✅ Superadmin seeded — username: ${username}`);
    }
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
