console.log("Hello, world!");
document.getElementById('run-test').addEventListener('click', () => {
    console.log("fetching /api/rng");
    fetch('/api/rng')
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
});