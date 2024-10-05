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
            this.stateData = this.req.session.rng[this.key];
            this.seed = this.stateData.seed;

            var temprng = new seedrandom(this.seed, { state: true });
            var state = temprng.state();
            state.i = this.stateData.i;
            state.j = this.stateData.j;

            this.rng = new seedrandom("", { state: state });

            console.log(`Loaded existing state for key ${key}: ${this.stateData.seed}, ${this.stateData.i}, ${this.stateData.j}`);
        }
    }

    commitState() {
        var state = this.rng.state();
        this.stateData = {
            seed: this.seed,
            i: state.i,
            j: state.j
        };
        console.log(`Committing state for key ${this.key}: ${this.stateData.seed}, ${this.stateData.i}, ${this.stateData.j}`);
        this.req.session.rng[this.key] = this.stateData;
    }

    getState() {
        return this.stateData;
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