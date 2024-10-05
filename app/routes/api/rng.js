const express = require('express');
const router = express.Router();
const seedrandom = require('seedrandom');

const lzstring = require('lz-string');
const fastintcompression = require('fastintcompression');

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function getSeed(req) {
    if (!req.session.seed) {
        const seed = generateRandomString(7);
        req.session.seed = seed;
    }
    return req.session.seed;
}

router.get('/seed', (req, res) => {
    const seed = getSeed(req);
    res.json({ seed: seed });
});

router.get('/rng', (req, res) => {
    const seed = getSeed(req);
    const rng = seedrandom(seed, { state: true });
    console.log(rng());
    console.log(rng());
    console.log(rng());
    const rngState = rng.state();
    console.log(rngState);
    console.log(rngState.S);
    
    const compressed = fastintcompression.compress(rngState.S);
    const buffer = new Uint8Array(compressed).buffer;
    const string = lzstring.compressToEncodedURIComponent(String.fromCharCode.apply(null, new Uint8Array(buffer)));
    
    console.log(compressed);
    console.log(string);
    console.log(string.length);
    
    const rngStateString = JSON.stringify(rng.state());
    const objCompressed = lzstring.compressToEncodedURIComponent(rngStateString);
    console.log(objCompressed);
    console.log(objCompressed.length);

    res.json({ seed: req.session.seed });
});

module.exports = router;