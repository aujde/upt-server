var rng;

document.getElementById('state').addEventListener('click', () => {
    console.log("fetching /api/rngstate");
    fetch('/api/rngstate?key=test')
        .then(response => response.json())
        .then(data => {
            
            var temprng = new Math.seedrandom(data.seed, { state: true });
            var state = temprng.state();

            state.i = data.i;
            state.j = data.j;

            rng = new Math.seedrandom("", { state: state });
            console.log("seedrandom created with state",rng.state());

        })
        .catch(error => {
            console.error('Error:', error);
        });
});

document.getElementById('server-next').addEventListener('click', () => {
    console.log("fetching /api/genten");
    fetch('/api/genten?key=test')
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

document.getElementById('next').addEventListener('click', () => {
    if (rng) {
        var string = "";
        for (var i = 0; i < 10; i++) {
            var number = rng();
            string += number + " ";
        }
        var state = rng.state();
        console.log("state",state);
        console.log(string);
    } else {
        console.warn("No RNG state loaded");
    }
});