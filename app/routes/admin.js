const express = require('express');
const router = express.Router();

router.get('/admin', (req, res) => {
    res.render('admin', { user: req.session.user });
});

module.exports = router;