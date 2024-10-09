const MongoDB = require('../utils/db');
const { hashPassword, comparePasswords } = require('../utils/auth');

class GameUser {
    async login(username, password) {
        const user = await MongoDB.find(process.env.MONGODB_TABLE_GAMEUSERS, { username: username });
        if (user.length > 0 && await comparePasswords(password, user[0].password)) {
            return user[0];
        } else {
            throw new Error('Invalid username or password');
        }
    }

    async register(username, password, password2) {
        if (password !== password2) {
            throw new Error('Passwords do not match');
        }
        const user = await MongoDB.find(process.env.MONGODB_TABLE_GAMEUSERS, { username: username });
        if (user.length > 0) {
            throw new Error('Username already exists');
        }
        const hashedPassword = await hashPassword(password);
        await MongoDB.insertOne(process.env.MONGODB_TABLE_GAMEUSERS, { username: username, password: hashedPassword });
    }

    loadData(data) {
        this.username = data.username;
        this.password = data.password;
    }
}

module.exports = GameUser;