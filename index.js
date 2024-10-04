require('dotenv').config();

const express = require('express');
const session = require('express-session');
const path = require('path');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'defaultsecret',
    resave: false,
    saveUninitialized: false
}));

// Session-persisted message middleware

app.use(function(req, res, next){
    var err = req.session.error;
    var msg = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = '';
    if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
    if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
    next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
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
});

const PORT = process.env.PORT || 3000;
const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_SERVER}`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

/**/

function hashPassword(password) {
    const hash = require('pbkdf2-password')();
    const salt = process.env.SALT || 'defaultsalt';

    return new Promise((resolve, reject) => {
        hash({ password: password, salt: salt }, function (err, pass, salt, hash) {
            if (err) {
                reject(err);
            } else {
                resolve(hash);
            }
        });
    });
}

function authenticate(name, pass, fn) {
    hashPassword(pass).then(hash => {
        checkLogin(name, hash, fn);
    }).catch(err => {
        console.error('Error hashing password:', err);
        fn(err); // Call the callback with the error
    });
}

async function checkLogin(username, passwordHash, fn) {
    try {
        await client.connect();
        const user = await client.db(process.env.MONGODB_DATABASE).collection(process.env.MONGODB_TABLE_ADMINUSERS).findOne({ 
            username: username,
            password: passwordHash
        });

        console.log('mongo checkLogin response:', user);
        fn(null, user); // Call the callback with the user data

    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
        fn(error); // Call the callback with the error
    } finally {
        await client.close();
    }
}

/**/

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.render('login');
});

app.post('/login', function (req, res, next) {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        authenticate(username, password, function (err, user) {
            if (user) {
                req.session.regenerate(function () {
                    req.session.user = user;
                    req.session.success = 'Authenticated as ' + user.username;
                    res.redirect('/admin');
                });
            } else {
                req.session.error = 'Authentication failed, please check your username and password.';
                res.redirect('/');
            }
        });
    } else {
        req.session.error = 'Authentication failed, please check your username and password.';
        res.redirect('/');
    }
});

app.get('/logout', function (req, res) {
    req.session.destroy(function () {
        req.session.success = 'Logged out';
        res.redirect('/');
    });
});

app.get('/admin', function (req, res) {
    res.render('admin');
});

app.get('/status', (req, res) => {
    res.json({ status: 'ok' });
});