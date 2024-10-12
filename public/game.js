import Looter from './looter.js';

var game;

class ClientGame {
    updateInterval = 980;
    lastTick;
    state = {};

    init() {
        this.lastTick = Date.now();
        this.getGameState().then(() => {
            window.setInterval(() => {
                this.tick();
            }, this.updateInterval);
        });
    }

    getGameState() {
        return fetch('/api/getState').then(response => {
            return response.json();
        }).then(data => {
            this.updateState(data.state);

            // Calculate loot so far
            if (this.state.ca.index == 0) { return; }
            var timeSinceStart = Date.now() - this.state.ca.start;
            var cyclesSoFar = Math.floor(timeSinceStart / this.state.ca.duration);
            var rng = this.state.ca.seed;
            var loot, caRng;
            [loot, caRng] = looter.calculatePeriod(this.state.ca.index, this.state.ca.subaction, this.state, cyclesSoFar, rng);
            this.state.ca.rngState = caRng.state();
            console.log("Loot so far:", loot);
            this.state.ca.loot = loot;

            document.getElementById('cycle-count').innerHTML = cyclesSoFar;
            document.getElementById('cycle-loot-a').innerHTML = loot[1] || 0;
            document.getElementById('cycle-loot-b').innerHTML = loot[2] || 0;
        });
    }

    tick() {
        if (this.state.ca.index == 0) { this.lastTick = Date.now(); return; }

        var timeSinceStart = Date.now() - this.state.ca.start;
        var cyclesSoFar = Math.floor(timeSinceStart / this.state.ca.duration);
        var progress = (timeSinceStart % this.state.ca.duration) / this.state.ca.duration;

        // if a cycle completed, process the action
        var timeSinceStart_lastLoop = this.lastTick - this.state.ca.start;
        var cyclesSoFar_lastLoop = Math.floor(timeSinceStart_lastLoop / this.state.ca.duration);
        if (cyclesSoFar_lastLoop < cyclesSoFar) {
            var loot;
            [loot, this.state.ca.rngState] = looter.rollLoot(this.state.ca.index, this.state.ca.subaction, this.state, this.state.ca.rngState, cyclesSoFar);
            console.log("Loot:", loot);
            for (var key in loot) {
                if (this.state.ca.loot[key]) {
                    this.state.ca.loot[key] += loot[key];
                } else {
                    this.state.ca.loot[key] = loot[key];
                }
            }

            document.getElementById('cycle-progress-front').style.width = '0%';
            document.getElementById('cycle-progress-front').style.transition = 'width 0s linear';

            document.getElementById('cycle-count').innerHTML = cyclesSoFar;
            document.getElementById('cycle-loot-a').innerHTML = this.state.ca.loot[1] || 0;
            document.getElementById('cycle-loot-b').innerHTML = this.state.ca.loot[2] || 0;
            console.log("set progress to 0");
        } else {
            document.getElementById('cycle-progress-front').style.width = (progress * 100) + '%';
            document.getElementById('cycle-progress-front').style.transition = 'width ' + (this.updateInterval / 1000) + 's linear';
            console.log("set progress to " + (progress * 100) + '%');
        }

        this.lastTick = Date.now();
    }

    setAction(action, subAction) {
        fetch('/api/setAction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: action, subAction: subAction })
        }).then(response => {
            return response.json();
        }).then(data => {
            this.updateState(data.state);
        });
    }

    updateState(newState) {
        console.log("Updating state", newState);
        this.state = newState;
        document.getElementById('player-action').innerHTML = this.state.ca.index;
        document.getElementById('action-seed').innerHTML = this.state.ca.seed;

        if (this.state.ca.index == 0) { return;}
        this.state.ca.duration = looter.getActionDuration(this.state.ca.index, this.state.ca.subaction, this.state);
    }
        
}

var looter = new Looter();

window.addEventListener('load', () => {
    game = new ClientGame();

    document.getElementById('init').addEventListener('click', () => {
        game.init();
    });

    document.getElementById('action-a-1').addEventListener('click', () => {
        game.setAction(1, 1);
    });

    document.getElementById('action-a-2').addEventListener('click', () => {
        game.setAction(1, 2);
    });

    document.getElementById('action-b-1').addEventListener('click', () => {
        game.setAction(2, 1);
    });

    document.getElementById('action-b-2').addEventListener('click', () => {
        game.setAction(2, 2);
    });

    document.getElementById('stop').addEventListener('click', () => {
        game.setAction(0);
    });
});