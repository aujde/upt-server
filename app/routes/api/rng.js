const express = require('express');
const router = express.Router();

router.get('/seed', (req, res) => {
    if (!req.session.seed) {
        const seed = generateRandomString(7);
        req.session.seed = seed;
    }
    
    res.json({ seed: req.session.seed });
});

module.exports = router;