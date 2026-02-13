const User = require('./models/User');
const sequelize = require('./config/database');

const disableMFA = async (username) => {
    try {
        await sequelize.authenticate();
        const user = await User.findOne({ where: { username } });

        if (!user) {
            console.log(`❌ User "${username}" not found`);
            process.exit(1);
        }

        await user.update({
            mfaEnabled: false,
            mfaSecret: null
        });

        console.log(`✅ MFA DISABLED for user: ${username}`);
        console.log(`   You can now login without OTP`);
    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        process.exit();
    }
};

const username = process.argv[2] || 'invest1';
disableMFA(username);
