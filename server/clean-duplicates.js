const User = require('./models/User');
const sequelize = require('./config/database');

const cleanDuplicates = async () => {
    try {
        await sequelize.authenticate();

        // Delete users with trailing spaces (IDs 3 and 4)
        await User.destroy({ where: { id: [3, 4] } });

        console.log("✅ Cleaned up duplicate users with trailing spaces");

        // Show remaining users
        const users = await User.findAll({
            attributes: ['id', 'username', 'role', 'mfaEnabled'],
            order: [['id', 'ASC']],
            raw: true
        });

        console.log("\n📋 Remaining users:");
        console.log(JSON.stringify(users, null, 2));

    } catch (err) {
        console.error("❌ Error:", err.message);
    } finally {
        process.exit();
    }
};

cleanDuplicates();
