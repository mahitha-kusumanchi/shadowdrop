const Report = require('./models/Report');
const sequelize = require('./config/database');

const checkReports = async () => {
    try {
        await sequelize.authenticate();
        const reports = await Report.findAll();

        console.log(`\n📊 Total Reports: ${reports.length}\n`);

        if (reports.length === 0) {
            console.log('❌ No reports found in database!');
            console.log('💡 Submit a test report from the homepage first:\n');
            console.log('   1. Go to http://localhost:5173');
            console.log('   2. Fill out the whistleblower form');
            console.log('   3. Submit a report');
            console.log('   4. Then login to admin dashboard to decrypt it\n');
        } else {
            reports.forEach((r, i) => {
                console.log(`Report ${i + 1}:`);
                console.log(`  ID: ${r.reportId}`);
                console.log(`  Status: ${r.status}`);
                console.log(`  Has encrypted data: ${r.encryptedData ? 'YES' : 'NO'}`);
                console.log(`  Has encrypted key: ${r.encryptedKey ? 'YES' : 'NO'}`);
                console.log(`  Has IV: ${r.iv ? 'YES' : 'NO'}`);
                console.log('');
            });
        }
    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        process.exit();
    }
};

checkReports();
