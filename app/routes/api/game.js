const express = require('express');
const router = express.Router();
const GameUser = require('../../entity/gameuser');

router.get('/getState', (req, res) => {
    console.log('get state for user:', req.session.user.username);

    const user = new GameUser();
    user.load(req.session.user.username).then(() => {
        res.json({ state: user.state });
    });

});

module.exports = router;