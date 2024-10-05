function appendToOutput(str) {
    const outputDiv = document.getElementById('test-output');
    if (outputDiv) {
        const newContent = document.createElement('div');
        newContent.textContent = str;
        outputDiv.appendChild(newContent);
    }
}

document.getElementById('seed').addEventListener('click', () => {
    console.log("fetching /api/seed");
    fetch('/api/seed')
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

document.getElementById('next').addEventListener('click', () => {
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