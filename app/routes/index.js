const express = require('express');
const router = express.Router();
const { authenticate } = require('../utils/auth');
const GameUser = require('../entity/gameuser');

router.get('/', (req, res) => {
    res.render('game/login');
});

router.get('/game', (req, res) => {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        res.render('game/game', { user: req.session.user });
    }
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log('logging in user:', username);
    const user = new GameUser();
    user.login(username, password).then(user => {
        req.session.success = 'Logged in as ' + user.username;
        req.session.user = user;
        res.redirect('/game');
    }).catch(err => {
        req.session.error = err.message;
        res.redirect('/');
    });
});

router.post('/register', (req, res) => {
    const { username, password, password2 } = req.body;
    console.log('registering user:', username);
    const user = new GameUser();
    user.register(username, password, password2).then(() => {
        req.session.success = 'Registered user: ' + username;
        res.redirect('/');
    }).catch(err => {
        req.session.error = err.message;
        res.redirect('/');
    });
});

module.exports = router;