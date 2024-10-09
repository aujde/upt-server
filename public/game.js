var game;

class ClientGame {
    state = {
        currentAction: null,
    }

    getGameState() {
        fetch('/api/getState').then(response => {
            return response.json();
        }).then(data => {
            console.log(data);
            this.state = data.state;
        });

    }
}

window.addEventListener('load', () => {
    game = new ClientGame();
    
    document.getElementById('init').addEventListener('click', () => {
        game.getGameState();

    });
});