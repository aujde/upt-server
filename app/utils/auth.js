const bcrypt = require('bcrypt');
const MongoDB = require('./db');

const saltRounds = 10;

async function hashPassword(password) {
    return bcrypt.hash(password + process.env.SALT, saltRounds);
}

async function authenticateAdmin(name, pass, fn) {
    try {
        const user = await MongoDB.find(process.env.MONGODB_TABLE_ADMINUSERS, { username: name });
        console.log('user:', user, name, pass);
        if (user.length > 0 && await bcrypt.compare(pass + process.env.SALT, user[0].password)) {
            fn(null, user[0]);
        } else {
            fn(new Error('Invalid username or password'));
        }
    } catch (err) {
        console.error('Error during authentication:', err);
        fn(err);
    }
}

module.exports = { authenticateAdmin };