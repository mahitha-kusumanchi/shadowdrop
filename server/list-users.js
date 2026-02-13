const User = require('./models/User');
const sequelize = require('./config/database');

const listUsers = async () => {
    try {
        // Ensure connection logic is run
        await sequelize.authenticate();

        const users = await User.findAll();
        console.log("\n====== 👥 REGISTERED USERS ======");
        if (users.length === 0) {
            console.log("No users found in database.");
        } else {
            users.forEach(u => {
                console.log(`[${u.id}] Username: ${u.username.padEnd(20)} | Role: ${u.role.padEnd(15)} | MFA: ${u.mfaEnabled ? '✅' : '❌'}`);
            });
        }
        console.log("=================================\n");
    } catch (err) {
        console.error("❌ Error retrieving users:", err);
    } finally {
        // We don't want to close the connection if it's shared, but here it's a standalone script
        // However, sequelize.close() might be needed to exit the process cleanly
        // But since we are just reading, process.exit is fine.
        process.exit();
    }
};

listUsers();
