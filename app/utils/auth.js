const bcrypt = require('bcrypt');
const { connectToMongo } = require('./db');

const saltRounds = 10;

async function hashPassword(password) {
    return bcrypt.hash(password, saltRounds);
}

async function authenticate(name, pass, fn) {
    try {
        const client = await connectToMongo();
        const user = await client.db(process.env.MONGODB_DATABASE).collection(process.env.MONGODB_TABLE_ADMINUSERS).findOne({ 
            username: name
        });

        if (user && await bcrypt.compare(pass, user.password)) {
            fn(null, user);
        } else {
            fn(new Error('Invalid username or password'));
        }
    } catch (err) {
        console.error('Error during authentication:', err);
        fn(err);
    }
}

module.exports = { hashPassword, authenticate };