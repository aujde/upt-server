const express = require('express');
const router = express.Router();

router.get('/tests', (req, res) => {
    res.render('tests/index');
});

router.get('/tests/rngseed', (req, res) => {
    res.render('tests/rngseed');
});

module.exports = router;