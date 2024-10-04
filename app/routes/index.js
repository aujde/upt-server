const express = require('express');
const router = express.Router();
const { authenticate } = require('../utils/auth');

router.get('/', (req, res) => {
    res.render('login');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    authenticate(username, password, (err, user) => {
        if (err) {
            req.session.error = err.message;
            console.log('user failed to authenticate: ', err);
            res.redirect('/');
        } else {
            req.session.user = user;
            console.log('user authenticated: ', user);
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

module.exports = router;