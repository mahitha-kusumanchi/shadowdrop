const router = require('express').Router();
const reportController = require('../controllers/reportController');
const verifyToken = require('../middleware/auth');
const { checkRole } = require('../middleware/roles');

router.post('/', (req, res) => reportController.createReport(req, res));

router.get('/',
    (req, res, next) => verifyToken(req, res, next),
    checkRole('readAny', 'report'),
    (req, res) => reportController.getAllReports(req, res)
);

router.patch('/:id/status',
    (req, res, next) => verifyToken(req, res, next),
    checkRole('updateAny', 'report'),
    (req, res) => reportController.updateStatus(req, res)
);

router.delete('/:id',
    (req, res, next) => verifyToken(req, res, next),
    checkRole('deleteAny', 'report'),
    (req, res) => reportController.deleteReport(req, res)
);

module.exports = router;
