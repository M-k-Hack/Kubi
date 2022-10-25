function getRunningContainers() {
    fetch('/api/docker/running/')
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
        var div = document.getElementById('running');

        for (var i = 0; i < data.response.length; i++) {
            var element = document.createElement('div');

            var p = document.createElement('p');
            p.innerText = data.response[i].Image
            var p2 = document.createElement('p');
            p2.innerText = "Temps restant : " + data.response[i].Status;
            element.appendChild(p);
            element.appendChild(p2);
            div.appendChild(element);
        }
    })
}

function getAllImages() {
    fetch('/api/docker/images/')
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
        var div = document.getElementById('images');

        for (var i = 0; i < data.response.length; i++) {
            var p = document.createElement('p');
            p.innerText = data.response[i].RepoTags[0];
            div.appendChild(p);
        }
    })
}

getRunningContainers();
getAllImages();