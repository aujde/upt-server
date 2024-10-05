var rng = {};

document.getElementById('state').addEventListener('click', () => {
    console.log("fetching /api/rngstate");
    var key = document.getElementById('key').value;
    fetch('/api/rngstate?key=' + key)
        .then(response => response.json())
        .then(data => {

            rng[key] = new Math.seedrandom("", { state: data });
            console.log("seedrandom created with state",rng[key].state());

        })
        .catch(error => {
            console.error('Error:', error);
        });
});

document.getElementById('next').addEventListener('click', () => {
    var key = document.getElementById('key').value;

    if (!rng[key]) {
        console.warn("No RNG state loaded for key", key);
        return;
    }

    var local_gen = [];
    for (var i = 0; i < 10; i++) {
        var number = rng[key]();
        local_gen.push(number);
    }
    console.log("Client:", local_gen);

    console.log("fetching /api/genten with key:", key);
    fetch('/api/genten?key=' + key)
        .then(response => response.json())
        .then(data => {
            console.log("Server:", data);

            if (JSON.stringify(local_gen) === JSON.stringify(data)) {
                console.log("Sync test successful");
            } else {
                console.error("Sync test failed", local_gen, data);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    
});