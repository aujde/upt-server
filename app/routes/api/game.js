const express = require('express');
const router = express.Router();
const GameUser = require('../../entity/gameuser');

function isActionValid(action) {
    return [1,2].includes(action);
}

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

router.get('/getState', (req, res) => {
    console.log('get state for user:', req.session.user.username);

    const user = new GameUser();
    user.load(req.session.user.username).then(() => {
        res.json({ state: user.state });
    });
});

router.post('/setAction', (req, res) => {
    console.log('set action for user:', req.session.user.username, req.body.action, req.body.subAction);

    const user = new GameUser();
    user.load(req.session.user.username).then(() => {
        // Create new action state
        user.state.ca = {
            index: req.body.action,
            subaction: req.body.subAction,
            seed: `${req.body.action}${req.body.subAction}${Date.now()}${generateRandomString(6)}`,
            state: null,
            start: Date.now()
        };

        // Update user state
        user.update().then(() => {
            res.json({ state: user.state });
        });
    });
});

module.exports = router;