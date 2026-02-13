const User = require('./models/User');
const sequelize = require('./config/database');

const checkDuplicates = async () => {
    try {
        await sequelize.authenticate();
        const users = await User.findAll({
            attributes: ['id', 'username', 'role', 'mfaEnabled', 'createdAt'],
            order: [['id', 'ASC']]
        });

        console.log("\n====== ALL USERS IN DATABASE ======");
        console.log(`Total users: ${users.length}\n`);

        users.forEach(u => {
            console.log(`ID: ${u.id} | Username: ${u.username} | Role: ${u.role} | MFA: ${u.mfaEnabled ? '✅' : '❌'} | Created: ${u.createdAt}`);
        });

        // Check for duplicate usernames
        const usernames = users.map(u => u.username);
        const duplicates = usernames.filter((item, index) => usernames.indexOf(item) !== index);

        if (duplicates.length > 0) {
            console.log("\n⚠️  DUPLICATE USERNAMES FOUND:");
            console.log(duplicates);
        } else {
            console.log("\n✅ No duplicate usernames found");
        }

        console.log("===================================\n");
    } catch (err) {
        console.error("❌ Error:", err);
    } finally {
        process.exit();
    }
};

checkDuplicates();
