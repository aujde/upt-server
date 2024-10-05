const express = require('express');
const router = express.Router();
const seedrandom = require('seedrandom');
const RNG = require('../../utils/rng'); 

router.get('/rngstate', (req, res) => {
    const key = req.query.key || 'default';
    const rng = new RNG(req, key);

    res.json(rng.getState());
});

router.get('/genten', (req, res) => {
    const key = req.query.key || 'default';
    const rng = new RNG(req, key);

    var numbers = [];
    for (let i = 0; i < 10; i++) {
        numbers.push(rng.random());
    }
    res.json(numbers);
});

module.exports = router;