const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../utils/auth');

router.get('/', (req, res) => {
    res.render('admin/admin', { user: req.session.user });
});

router.get('/login', (req, res) => {
    res.render('admin/login');
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    authenticateAdmin(username, password, (err, user) => {
        if (err) {
            req.session.error = err.message;
            console.log('user failed to authenticate as admin: ', err);
            res.redirect('/admin/login');
        } else {
            req.session.userAdmin = user;
            console.log('user authenticated as admin: ', user);
            req.session.success = 'Authenticated as ' + user.username;
            res.redirect('/admin');
        }
    });
});

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

router.get('/tests', (req, res) => {
    res.render('tests/index');
});

router.get('/tests/rngseed', (req, res) => {
    res.render('tests/rngseed');
});

module.exports = router;