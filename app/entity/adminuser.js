const MongoDB = require('../utils/db');
const { hashPassword, comparePasswords } = require('../utils/auth');

class AdminUser {
    async login(username, password) {
        const user = await MongoDB.find(process.env.MONGODB_TABLE_ADMINUSERS, { username: username });
        if (user.length > 0 && await comparePasswords(password, user[0].password)) {
            return user[0];
        } else {
            throw new Error('Invalid username or password');
        }
    }
}

module.exports = AdminUser;