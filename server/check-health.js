try {
    const auth = require('./controllers/authController');
    const reports = require('./controllers/reportController');

    console.log('--- Health Check ---');
    console.log('Auth Keys:', Object.keys(auth));
    console.log('Report Keys:', Object.keys(reports));

    const missing = [];
    if (!auth.register) missing.push('auth.register');
    if (!auth.login) missing.push('auth.login');
    if (!auth.getAllUsers) missing.push('auth.getAllUsers');
    if (!reports.createReport) missing.push('reports.createReport');
    if (!reports.getAllReports) missing.push('reports.getAllReports');
    if (!reports.updateStatus) missing.push('reports.updateStatus');
    if (!reports.deleteReport) missing.push('reports.deleteReport');

    if (missing.length > 0) {
        console.error('❌ MISSING HANDLERS:', missing.join(', '));
        process.exit(1);
    } else {
        console.log('✅ All handlers confirmed!');
    }
} catch (err) {
    console.error('❌ Import Error:', err.message);
    process.exit(1);
}
process.exit(0);
