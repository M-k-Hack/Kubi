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
        var div = document.getElementById('running');
        var table = document.createElement('table');
        var tbody = document.createElement('tbody');

        for (var i = 0; i < data.response.length; i++) {
            var tr = document.createElement('tr');
            var td1 = document.createElement('td');
            var td2 = document.createElement('td');

            td1.innerText = data.response[i].Image;
            td2.innerText = data.response[i].Status;

            
            tr.appendChild(td1);
            tr.appendChild(td2);
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);
        div.appendChild(table);
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
        var table = document.createElement('table');
        var tbody = document.createElement('tbody');

        for (var i = 0; i < data.response.length; i++) {
            var tr = document.createElement('tr');
            var td1 = document.createElement('td');
            var td2 = document.createElement('td');

            td1.innerText = data.response[i].RepoTags[0];

            if(data.response[i].isInMongo) {
                td2 = document.createElement('td');
                td2.innerText = "IN MONGO";
            } else {
                td2 = document.createElement('td');
                td2.innerText = "NOT IN MONGO";
            }

            tr.appendChild(td1);
            tr.appendChild(td2);
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);
        div.appendChild(table);
    })
}

getRunningContainers();
getAllImages();