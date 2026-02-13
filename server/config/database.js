const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite', // File location
    logging: false // Disable logging SQL to console for cleaner output
});

module.exports = sequelize;
