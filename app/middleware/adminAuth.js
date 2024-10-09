module.exports = function(req, res, next) {
    if (req.url.startsWith('/admin') && req.url !== '/admin/login') {
        if (!req.session.admin) {
            req.session.error = 'Log in first please!';
            res.redirect('/admin/login');
        } else {
            next();
        }
    } else {
        next();
    }
};