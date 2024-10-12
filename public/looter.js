if ( !seedrandom ) { var seedrandom = Math.seedrandom; }

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

    rollLoot(action, subAction, state, rng) {
        if (typeof rng === 'string') {
            rng = seedrandom(rng, { state: true });
        } else if (typeof rng === 'object') {
            rng = seedrandom("", { state: rng });
        }

        console.log(rng);
        console.log(rng());
        console.log(rng());
        console.log(rng());
    }
}

export default Looter;