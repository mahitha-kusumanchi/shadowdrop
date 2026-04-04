require('dotenv').config();
const sequelize = require('./config/database');
const User = require('./models/User');
const argon2 = require('argon2');

const ADMIN_USERNAME = 'superadmin';
const ADMIN_PASSWORD = 'Admin@1234';
const ADMIN_ROLE = 'SuperAdmin';

const seed = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();

        const existing = await User.findOne({ where: { username: ADMIN_USERNAME } });
        if (existing) {
            console.log(`⚠️  User "${ADMIN_USERNAME}" already exists. No changes made.`);
            return;
        }

        const hashedPassword = await argon2.hash(ADMIN_PASSWORD);
        await User.create({
            username: ADMIN_USERNAME,
            password: hashedPassword,
            role: ADMIN_ROLE,
            mfaEnabled: false
        });

        console.log('✅ Super admin created successfully!');
        console.log(`   Username : ${ADMIN_USERNAME}`);
        console.log(`   Password : ${ADMIN_PASSWORD}`);
        console.log(`   Role     : ${ADMIN_ROLE}`);
        console.log('\n👉 Change your password after first login!');
    } catch (err) {
        console.error('❌ Error seeding admin:', err.message);
    } finally {
        process.exit();
    }
};

seed();
