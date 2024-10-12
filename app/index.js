require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const SecretManager = require('./utils/secret');

const app = express();
const secretManager = new SecretManager();

async function loadSecrets() {
    try {
        if (!process.env.SESSION_SECRET) {
            process.env.SESSION_SECRET = await secretManager.getSecret('UPT2_SESSION_SECRET');
        }

        if (!process.env.MONGODB_USER) {
            process.env.MONGODB_USER = await secretManager.getSecret('UPT2_MONGODB_USER');
        }

        if (!process.env.MONGODB_PASSWORD) {
            process.env.MONGODB_PASSWORD = await secretManager.getSecret('UPT2_MONGODB_PASSWORD');
        }

        if (!process.env.MONGODB_SERVER) {
            process.env.MONGODB_SERVER = await secretManager.getSecret('UPT2_MONGODB_SERVER');
        }

        if (!process.env.MONGODB_DATABASE) {
            process.env.MONGODB_DATABASE = await secretManager.getSecret('UPT2_MONGODB_DATABASE');
        }

        if (!process.env.SALT) {
            process.env.SALT = await secretManager.getSecret('UPT2_SALT');
        }
    } catch (err) {
        console.error('Failed to load secrets:', err.message);
        process.exit(1);
    }
}

loadSecrets().then(() => {
    const sessionMessages = require('./middleware/sessionMessages');
    const authAdminMiddleware = require('./middleware/adminAuth');
    const indexRoutes = require('./routes/index');
    const adminRoutes = require('./routes/admin');

    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { sameSite: 'strict' },
    }));

    app.use(sessionMessages);
    app.use(express.static(path.join(__dirname, '../public')));
    app.use(authAdminMiddleware);

    app.use('/', indexRoutes);
    app.use('/admin', adminRoutes);

    // Dynamically include all route files in the /routes/api/ directory
    const apiRoutesPath = path.join(__dirname, 'routes', 'api');
    fs.readdirSync(apiRoutesPath).forEach(file => {
        if (file.endsWith('.js')) {
            const route = require(path.join(apiRoutesPath, file));
            app.use('/api', route);
        }
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to load secrets:', err);
    process.exit(1);
});