const express = require('express');
const router = express.Router();
const AdminUser = require('../entity/adminuser');

router.get('/', (req, res) => {
    res.render('admin/admin', { user: req.session.admin });
});

router.get('/login', (req, res) => {
    res.render('admin/login');
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log('logging in admin:', username);
    const user = new AdminUser();
    user.login(username, password).then(user => {
        req.session.success = 'Logged in as ' + user.username;
        req.session.admin = user;
        res.redirect('/admin');
    }).catch(err => {
        req.session.error = err.message;
        res.redirect('/admin/login');
    });
});

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/admin/login');
    });
});

router.get('/rngseed', (req, res) => {
    res.render('admin/rngseed');
});

module.exports = router;