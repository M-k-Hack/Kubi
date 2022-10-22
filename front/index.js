// Get all containers for select 
function getContainer() {
    var data = {}
    fetch('/api/container')
        .then(response => response.json())
        .then(data => {
            var select = document.getElementById('standard-select');
            data = data.response

            for (var i = 0; i < data.length; i++) {

                var option = document.createElement('option');
                option.innerText = data[i].name;
                option.value = data[i].name_container;
                select.append(option);
            }
        })
        .catch(error => console.error(error));
}

// Get form to fill select
const form = document.getElementById('form-docker');

// Event listener for form
// When form is submitted, run function
// When 200 container started
// When 500 container not found
form.addEventListener('submit', (e) => {
    e.preventDefault();

    var div = document.createElement('div');
    div.className = "loader";
    div.id = "loader";

    document.body.appendChild(div);

    var container = document.getElementById('standard-select').value;
    fetch('/api/docker/start/' + container, {
        method: 'POST',
    })
    .then(data => {
        if(data.status == 200) {
            data.json().then(data => {
                var port = data.port;
                var div = document.getElementById('loader');
                div.remove();
                var p = document.createElement('p');
                p.innerText = "Container " + container + " started on domain "+ document.domain +" port " + port;
                p.className = "text-success";
                document.body.appendChild(p);
            })
        } else if(data.status == 500) {
            console.log("Error starting container, Container not Found !");
            var div = document.getElementById('loader');
                div.remove();
                var p = document.createElement('p');
                p.innerText = "Container not found";
                p.className = "text-failed";
                document.body.appendChild(p);
        }
    })
    .catch(error => {
        console.error(error)
    });

});

getContainer();