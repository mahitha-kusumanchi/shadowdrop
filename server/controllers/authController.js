const User = require('../models/User');
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

const generateToken = (user) => {
    return jwt.sign(
        { _id: user.id, role: user.role, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

exports.register = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        if (!username || !password) return res.status(400).json({ message: 'Missing fields' });

        // Trim username to prevent duplicates with spaces
        const trimmedUsername = username.trim();
        if (!trimmedUsername) return res.status(400).json({ message: 'Username cannot be empty' });

        const existingUser = await User.findOne({ where: { username: trimmedUsername } });
        if (existingUser) return res.status(400).json({ message: 'Username already exists' });

        const hashedPassword = await argon2.hash(password);
        await User.create({
            username: trimmedUsername,
            password: hashedPassword,
            role: role || 'Investigator'
        });
        res.status(201).json({ message: 'User created' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password, mfaToken } = req.body;

        // Trim username to handle accidental spaces
        const trimmedUsername = username?.trim();
        if (!trimmedUsername) return res.status(400).json({ message: 'Username required' });

        const user = await User.findOne({ where: { username: trimmedUsername } });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const validPassword = await argon2.verify(user.password, password);
        if (!validPassword) return res.status(400).json({ message: 'Invalid credentials' });

        if (user.mfaEnabled) {
            if (!mfaToken) return res.status(403).json({ message: 'MFA Token required', mfaRequired: true });
            const isValid = speakeasy.totp.verify({
                secret: user.mfaSecret,
                encoding: 'base32',
                token: mfaToken
            });
            if (!isValid) return res.status(403).json({ message: 'Invalid MFA Token' });
        }

        const token = generateToken(user);
        res.json({ token, role: user.role });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.setupMFA = async (req, res) => {
    try {
        const secret = speakeasy.generateSecret({
            name: `ShadowDrop (${req.user.username})`
        });
        await User.update({ mfaSecret: secret.base32 }, {
            where: { id: req.user._id }
        });
        const imageUrl = await qrcode.toDataURL(secret.otpauth_url);
        res.json({ secret: secret.base32, qrCode: imageUrl });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.verifyMFA = async (req, res) => {
    try {
        const { token } = req.body;
        const user = await User.findByPk(req.user._id);
        const isValid = speakeasy.totp.verify({
            secret: user.mfaSecret,
            encoding: 'base32',
            token: token
        });
        if (!isValid) return res.status(400).json({ message: 'Invalid Token' });
        await user.update({ mfaEnabled: true });
        res.json({ message: 'MFA Enabled Successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'role', 'mfaEnabled', 'createdAt']
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Prevent self-deletion
        if (parseInt(id) === req.user._id) {
            return res.status(400).json({ message: 'Cannot delete your own account' });
        }

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.destroy();
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
