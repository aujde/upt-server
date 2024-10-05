const seedrandom = require('seedrandom'); // Ensure seedrandom is imported correctly

class RNG {
    constructor(req, key) {
        this.req = req;
        this.key = key;

        if (!this.req.session.rng) {
            this.req.session.rng = {};
        }

        if (!this.req.session.rng[this.key]) {
            this.seed = this.generateRandomString(7) + Date.now();
            this.rng = seedrandom(this.seed, { state: true });
            this.commitState();

            console.log(`Generated new state for key ${key}: ${this.seed}`);
        } else {
            this.rng = new seedrandom("", { state: this.req.session.rng[this.key] });
            console.log(`Loaded existing state for key ${key}`);
        }
    }

    commitState() {
        this.req.session.rng[this.key] = this.rng.state();
    }

    getState() {
        return this.req.session.rng[this.key];
    }

    random() {
        const number = this.rng();
        this.commitState();
        return number;
    }

    generateRandomString(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }
}

module.exports = RNG;