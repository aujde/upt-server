const express = require('express');
const router = express.Router();
const { authenticate } = require('../utils/auth');

router.get('/', (req, res) => {
    res.render('game/login');
});

module.exports = router;