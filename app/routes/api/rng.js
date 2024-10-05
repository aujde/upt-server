const express = require('express');
const router = express.Router();
const seedrandom = require('seedrandom');

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// class RNG:
// - accept 'key' to indicate the relevant sequence
// - check user session for existing state for key
// - if no state, generate new state and store in session
// - create seedrandom object with state
// - return random number or series of numbers along with seed and i, j values from state
// - read state from seedrandom object and store in session
class RNG {
    constructor(req, key) {
        this.req = req;
        this.key = key;

        if (!this.req.session.rng) {
            this.req.session.rng = {};
        }

        if (!this.req.session.rng[this.key]) {
            this.seed = generateRandomString(7) + Date.now();
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

            console.log(`Loaded existing state for key ${key}: ${this.stateData.seed}`);
        }
    }

    commitState() {
        var state = this.rng.state();
        this.stateData = {
            seed: this.seed,
            i: state.i,
            j: state.j,
            S: state.S
        };
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
}

router.get('/rngstate', (req, res) => {
    const key = req.query.key || 'default';
    const rng = new RNG(req, key);

    res.json(rng.getState());
});

router.get('/genten', (req, res) => {
    const key = req.query.key || 'default';
    const rng = new RNG(req, key);

    var numbers = [];
    for (let i = 0; i < 10; i++) {
        numbers.push(rng.random());
    }
    res.json(numbers);
});

module.exports = router;