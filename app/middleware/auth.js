module.exports = function(req, res, next) {
    if (!req.session.user) {
        if (req.url === '/' || req.url === '/login') {
            next();
        } else {
            req.session.error = 'Log in first please!';
            res.redirect('/');
        }
    } else {
        next();
    }
};