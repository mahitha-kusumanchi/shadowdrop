const User = require('./models/User');
const argon2 = require('argon2');
const sequelize = require('./config/database');

const run = async () => {
    try {
        await sequelize.authenticate();
        const hashedPassword = await argon2.hash('password123');
        const [user, created] = await User.findOrCreate({
            where: { username: 'admin' },
            defaults: {
                password: hashedPassword,
                role: 'SuperAdmin',
                mfaEnabled: false
            }
        });

        if (!created) {
            await user.update({
                password: hashedPassword,
                role: 'SuperAdmin',
                mfaEnabled: false,
                mfaSecret: null
            });
        }
        console.log("✅ Admin account FORCED to: admin / password123 (SuperAdmin)");
    } catch (e) {
        console.error("❌ Error forcing admin:", e);
    } finally {
        process.exit();
    }
};
run();
