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

    async load(username) {
        const user = await MongoDB.find(process.env.MONGODB_TABLE_GAMEUSERS, { username: username });
        if (user.length > 0) {
            this.loadData(user[0]);
        }
    }

    async update() {
        await MongoDB.updateOne(process.env.MONGODB_TABLE_GAMEUSERS, { username: this.username }, { $set: { state: this.state } });
    }

    loadData(data) {
        this.username = data.username;
        this.state = data.state;
        if (!this.state) {
            this.state = {};
        }
        
        for (const key in this.newUserState) {
            if (!(key in this.state)) {
                this.state[key] = this.newUserState[key];
            }
        }
    }

    newUserState = {
        ca: {
            index: 0,
            seed: null,
            state: null,
            start: null
        },
        inventory: {}
    }
}

module.exports = GameUser;