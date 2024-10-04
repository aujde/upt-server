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
        hashPassword(password).then(hash => {
            console.log('Hashed password:', hash);
        }).catch(err => {
            console.error('Error hashing password:', err);
        });
    } else {
        req.session.error = 'Authentication failed, please check your username and password.';
        res.redirect('/');
    }
});

app.get('/status', (req, res) => {
    res.json({ status: 'ok' });
});

async function run() {
    try {
        // Connect the client to the server (optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);