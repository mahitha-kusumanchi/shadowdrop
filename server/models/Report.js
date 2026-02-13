const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Report = sequelize.define('Report', {
    reportId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true
    },
    encryptedData: {
        type: DataTypes.TEXT, // Base64 string can be long
        allowNull: false
    },
    encryptedKey: {
        type: DataTypes.TEXT, // Base64 string
        allowNull: false
    },
    iv: {
        type: DataTypes.STRING, // Base64 IV
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending' // pending, investigating, resolved, dismissed
    },
    // Digital Signature Fields
    signature: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    signedBy: {
        type: DataTypes.STRING,
        allowNull: true
    },
    signedAt: {
        type: DataTypes.DATE, // Stored as datetime in SQLite
        allowNull: true
    }
});

module.exports = Report;
