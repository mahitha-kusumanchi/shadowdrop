require('dotenv').config();
const sequelize = require('./config/database');
const User = require('./models/User');
const argon2 = require('argon2');

const seedAdmin = async () => {
    try {
        await sequelize.sync();

        const hashedPassword = await argon2.hash('password123');

        // Upsert (Create or Update)
        const [user, created] = await User.findOrCreate({
            where: { username: 'admin' },
            defaults: {
                password: hashedPassword,
                role: 'SuperAdmin' // Promoted to SuperAdmin
            }
        });

        if (!created) {
            user.role = 'SuperAdmin';
            user.password = hashedPassword; // Reset password just in case
            await user.save();
            console.log('✅ Admin user updated to SuperAdmin.');
        } else {
            console.log('✅ SuperAdmin user created.');
        }

        console.log('Username: admin');
        console.log('Password: password123');
        console.log('Role: SuperAdmin');

    } catch (err) {
        console.error('❌ Error seeding admin:', err);
    } finally {
        process.exit();
    }
};

seedAdmin();
