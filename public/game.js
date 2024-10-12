import Looter from './looter.js';

var game;

class ClientGame {
    updateInterval = 980;
    lastTick = Date.now();
    state = {}

    init() {
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
        });
    }

    tick() {
        if (this.state.ca.index == 0) { return; }

        var timeSinceStart = Date.now() - this.state.ca.start;
        var cyclesSoFar = Math.floor(timeSinceStart / this.state.ca.duration);
        var progress = (timeSinceStart % this.state.ca.duration) / this.state.ca.duration;
        console.log(timeSinceStart, cyclesSoFar, progress);

        

        // if a cycle completed, process the action
        var timeSinceStart_lastLoop = this.lastTick - this.state.ca.start;
        var cyclesSoFar_lastLoop = Math.floor(timeSinceStart_lastLoop / this.state.ca.duration);
        if (cyclesSoFar_lastLoop < cyclesSoFar) {
            console.log("Loot!");
            document.getElementById('cycle-progress-front').style.width = '0%';
            document.getElementById('cycle-progress-front').style.transition = 'width 0.1s linear';

            document.getElementById('cycle-count').innerHTML = cyclesSoFar;
        } else {
            document.getElementById('cycle-progress-front').style.width = (progress * 100) + '%';
            document.getElementById('cycle-progress-front').style.transition = 'width ' + (this.updateInterval / 1000) + 's linear';
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
});