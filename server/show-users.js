const User = require('./models/User');
const sequelize = require('./config/database');

const checkDatabase = async () => {
    try {
        await sequelize.authenticate();
        const users = await User.findAll({
            attributes: ['id', 'username', 'role', 'mfaEnabled'],
            order: [['id', 'ASC']],
            raw: true
        });

        console.log(JSON.stringify(users, null, 2));
    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        process.exit();
    }
};

checkDatabase();
