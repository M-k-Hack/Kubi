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

getContainer()