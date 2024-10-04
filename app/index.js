require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const app = express();

const sessionMessages = require('./middleware/sessionMessages');
const authMiddleware = require('./middleware/auth');
const indexRoutes = require('./routes/index');
const adminRoutes = require('./routes/admin');
const testRoutes = require('./routes/test');

const { hashPassword } = require('./utils/auth');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'defaultsecret',
    resave: false,
    saveUninitialized: false
}));

app.use(sessionMessages);
app.use(express.static(path.join(__dirname, '../public')));
app.use(authMiddleware);

app.use('/', indexRoutes);
app.use('/', adminRoutes);
app.use('/', testRoutes);

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