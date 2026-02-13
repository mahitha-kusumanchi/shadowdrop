const router = require('express').Router();
const { getPublicKey } = require('../config/keys');

router.get('/public-key', (req, res) => {
    try {
        const publicKey = getPublicKey();
        res.json({ publicKey });
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve key' });
    }
});

module.exports = router;
