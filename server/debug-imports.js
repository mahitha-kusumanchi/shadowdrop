try {
    const authController = require('./controllers/authController');
    const reportController = require('./controllers/reportController');
    const verifyToken = require('./middleware/auth');
    const { checkRole } = require('./middleware/roles');

    console.log('--- Import Debug ---');
    console.log('verifyToken type:', typeof verifyToken);
    console.log('checkRole type:', typeof checkRole);
    console.log('authController.getAllUsers type:', typeof authController.getAllUsers);
    console.log('reportController.deleteReport type:', typeof reportController.deleteReport);

    if (typeof verifyToken !== 'function') console.error('❌ verifyToken is NOT a function');
    if (typeof checkRole !== 'function') console.error('❌ checkRole is NOT a function');

    // Check if checkRole returns a function
    try {
        const mid = checkRole('readAny', 'user');
        console.log('checkRole() return type:', typeof mid);
        if (typeof mid !== 'function') console.error('❌ checkRole() did NOT return a function');
    } catch (e) {
        console.error('❌ checkRole() crashed:', e.message);
    }

    if (typeof authController.getAllUsers !== 'function') console.error('❌ authController.getAllUsers is NOT a function');
    if (typeof reportController.deleteReport !== 'function') console.error('❌ reportController.deleteReport is NOT a function');

} catch (err) {
    console.error('❌ Import Fatal Error:', err.message);
}
process.exit(0);
