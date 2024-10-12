const express = require('express');
const router = express.Router();
const GameUser = require('../../entity/gameuser');
const Looter = require('../../looter');

function isActionValid(action) {
    return [1,2].includes(action);
}

function isSubActionValid(action, subAction) {
    if (action === 1) {
        return [1,2].includes(subAction);
    } else if (action === 2) {
        return [1,2].includes(subAction);
    }
    return false;
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

    if (!isActionValid(req.body.action) || !isSubActionValid(req.body.action, req.body.subAction)) {
        res.status(400).json({ error: 'Invalid action or subaction' });
        return;
    }

    const user = new GameUser();
    user.load(req.session.user.username).then(() => {
        var looter = new Looter();
        if (user.state.ca.index !== 0) {
            // Calculate loot and apply to inventory
            var timeSinceStart = Date.now() - user.state.ca.start;
            var elapsedCycles = Math.floor(timeSinceStart / looter.getActionDuration(user.state.ca.index, user.state.ca.subaction, user.state));
            for (var cycle = 0; cycle < elapsedCycles; cycle++) {
                var loot;
                [loot, user.state.ca.rngState] = looter.rollLoot(user.state.ca.index, user.state.ca.subaction, user.state, user.state.ca.rngState, cycle);
                for (var key in loot) {
                    if (user.state.inventory[key]) {
                        user.state.inventory[key] += loot[key];
                    } else {
                        user.state.inventory[key] = loot[key];
                    }
                }
            }
            console.log('Applied inventory:', loot, user.state.inventory);
        }

        if (req.body.action === 0) {
            // Stop action
            user.state.ca.index = 0;
            user.state.ca.subaction = 0;
            user.state.ca.seed = null;
            user.state.ca.rngState = null;
            user.state.ca.start = null;
            user.state.ca.loot = {};
            user.update().then(() => {
                res.json({ state: user.state });
            });
            return;
        }

        // Create new action state
        var newSeed = `${req.body.action}${req.body.subAction}${Date.now()}${generateRandomString(6)}`;
        user.state.ca.index = req.body.action;
        user.state.ca.subaction = req.body.subAction;
        user.state.ca.seed = newSeed;
        user.state.ca.rngState = newSeed;
        user.state.ca.start = Date.now();
        user.state.ca.loot = {};

        // Update user state
        user.update().then(() => {
            res.json({ state: user.state });
        });
    });
});

module.exports = router;