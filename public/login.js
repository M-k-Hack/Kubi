const form = document.getElementById('form-login');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    console.log(username);
    console.log(password);



    fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
        .then(response => {
            if(response.status == 200) {
                window.location.replace('/');
            } else if(response.status == 404) {
                alert("User not found");
            } else if(response.status == 401) {
                alert("Password incorrect");
            }
        })

        .then(data => {
            console.log(data);
        })
        .catch(error => console.error(error));
});