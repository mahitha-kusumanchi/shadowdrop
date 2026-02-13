const router = require('express').Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/auth');
const { checkRole } = require('../middleware/roles');

router.post('/register',
    (req, res, next) => verifyToken(req, res, next),
    checkRole('createAny', 'user'),
    (req, res) => authController.register(req, res)
);

router.post('/login', (req, res) => authController.login(req, res));

router.get('/users',
    (req, res, next) => verifyToken(req, res, next),
    checkRole('readAny', 'user'),
    (req, res) => authController.getAllUsers(req, res)
);

router.get('/mfa/setup',
    (req, res, next) => verifyToken(req, res, next),
    (req, res) => authController.setupMFA(req, res)
);

router.post('/mfa/verify',
    (req, res, next) => verifyToken(req, res, next),
    (req, res) => authController.verifyMFA(req, res)
);

module.exports = router;
