const seedrandom = require('seedrandom');

class Looter {
    getActionDuration(action, subAction, state) {
        if (action === 1 && subAction === 1) {
            return 20000;
        } else if (action === 1 && subAction === 2) {
            return 10000;
        } else if (action === 2 && subAction === 1) {
            return 3000;
        } else if (action === 2 && subAction === 2) {
            return 6000;
        } else {
            return false;
        }
    }

    rollLoot(action, subAction, state, rng, cycle) {
        var rng = this.createRNG(rng);
        var loot = {};

        if (action === 1 && subAction === 1) {
            if (rng() > 0.5) {
                loot[1] = 4;
            } else {
                loot[1] = 5;
            }
        } else if (action === 1 && subAction === 2) {
            if (cycle % 2 === 0) {
                loot[1] = 3;
            } else {
                loot[1] = 2;
            }
        } else if (action === 2 && subAction === 1) {
            loot[2] = 1 + Math.floor(Math.sqrt(cycle));
        } else if (action === 2 && subAction === 2) {
            var roll = rng();
            if (roll < 0.5) {
                // pass
            } else if (roll < 0.99) {
                loot[2] = 1;
            } else {
                loot[2] = 100;
            }
        }

        return [loot, rng];
    }

    calculatePeriod(action, subAction, state, cycles, rng) {
        var rng = this.createRNG(rng);
        var loot = {};

        for (var cycle = 0; cycle < cycles; cycle++) {
            var lootCycle;
            [lootCycle, rng] = this.rollLoot(action, subAction, state, rng, cycle);
            for (var key in lootCycle) {
                if (loot[key]) {
                    loot[key] += lootCycle[key];
                } else {
                    loot[key] = lootCycle[key];
                }
            }
        }

        return [loot, rng];
    }

    createRNG(rng) {
        if (typeof rng === 'string') {
            return seedrandom(rng, { state: true });
        } else if (typeof rng === 'object') {
            return seedrandom("", { state: rng });
        } else {
            return rng;
        }
    }
}

module.exports = Looter;