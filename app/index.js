require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();

const sessionMessages = require('./middleware/sessionMessages');
const authMiddleware = require('./middleware/auth');
const indexRoutes = require('./routes/index');
const adminRoutes = require('./routes/admin');
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});