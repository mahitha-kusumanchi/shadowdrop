const User = require('./models/User');
const argon2 = require('argon2');
const sequelize = require('./config/database');

const setupUsers = async () => {
    try {
        await sequelize.authenticate();
        console.log('\n📋 Current Users in Database:\n');

        const users = await User.findAll({
            attributes: ['username', 'role', 'mfaEnabled']
        });

        users.forEach(u => {
            console.log(`✓ ${u.username.padEnd(20)} | Role: ${u.role.padEnd(15)} | MFA: ${u.mfaEnabled ? 'ON' : 'OFF'}`);
        });

        console.log('\n🔧 Creating/Updating Users...\n');

        const usersToCreate = [
            { username: 'admin', password: 'password123', role: 'SuperAdmin' },
            { username: 'invest1', password: 'pass1', role: 'Investigator' },
            { username: 'agent_smith', password: '123', role: 'Investigator' },
            { username: 'intern_bob', password: '123', role: 'Auditor' }
        ];

        for (const userData of usersToCreate) {
            const hashedPassword = await argon2.hash(userData.password);
            const [user, created] = await User.findOrCreate({
                where: { username: userData.username },
                defaults: {
                    password: hashedPassword,
                    role: userData.role,
                    mfaEnabled: false,
                    mfaSecret: null
                }
            });

            if (!created) {
                await user.update({
                    password: hashedPassword,
                    role: userData.role,
                    mfaEnabled: false,
                    mfaSecret: null
                });
                console.log(`♻️  Updated: ${userData.username} (${userData.role})`);
            } else {
                console.log(`✅ Created: ${userData.username} (${userData.role})`);
            }
        }

        console.log('\n✅ All users are ready! Login credentials:\n');
        console.log('═'.repeat(60));
        usersToCreate.forEach(u => {
            console.log(`Username: ${u.username.padEnd(15)} | Password: ${u.password.padEnd(15)} | Role: ${u.role}`);
        });
        console.log('═'.repeat(60));

    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        process.exit();
    }
};

setupUsers();
