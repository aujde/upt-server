const express = require('express');
const router = express.Router();

router.get('/tests', (req, res) => {
    res.render('tests/index');
});

module.exports = router;