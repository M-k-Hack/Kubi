const button = document.getElementById('button-docker');

button.addEventListener('click', (e) => {
    e.preventDefault();

    fetch('/api/docker/running/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: document.getElementById('text-docker').value,
        })
    })
    .then(response => {
        if(response.status == 200) {
            return response.json()
        } else if(response.status == 403) {
            console.log("Forbidden");
            alert("Access denied");
        }
    })
    .then(data => {
        console.log(data);
    })
});