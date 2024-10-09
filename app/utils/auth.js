const bcrypt = require('bcrypt');
const MongoDB = require('./db');

const saltRounds = 10;

async function hashPassword(password) {
    return bcrypt.hash(password + process.env.SALT, saltRounds);
}

async function comparePasswords(password, hash) {
    return bcrypt.compare(password + process.env.SALT, hash);
}

module.exports = { hashPassword, comparePasswords };