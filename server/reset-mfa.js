const User = require('./models/User');
const sequelize = require('./config/database');

const resetMFA = async (username) => {
    try {
        await sequelize.authenticate();
        const user = await User.findOne({ where: { username } });

        if (!user) {
            console.log(`❌ User "${username}" not found.`);
            return;
        }

        await user.update({
            mfaEnabled: false,
            mfaSecret: null
        });

        console.log(`✅ MFA has been DISABLED for user: ${username}`);
        console.log(`You can now login with just your password.`);
    } catch (err) {
        console.error("❌ Error resetting MFA:", err);
    } finally {
        process.exit();
    }
};

// Change 'admin' to the username you are locked out of
const targetUser = process.argv[2] || 'admin';
resetMFA(targetUser);
