const express = require('express');
const router = express.Router();
const { authenticate } = require('../utils/auth');
const GameUser = require('../entity/gameuser');

router.get('/', (req, res) => {
    res.render('game/login');
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    authenticate(username, password, (err, user) => {
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

router.post('/register', (req, res) => {
    const { username, password, password2 } = req.body;
    console.log('registering user:', username);
    const user = new GameUser();
    user.register(username, password, password2).then(() => {
        req.session.success = 'Registered as ' + username;
        res.redirect('/');
    }).catch(err => {
        req.session.error = err.message;
        res.redirect('/');
    });
});

module.exports = router;