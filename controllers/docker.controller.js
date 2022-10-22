var DockerSocket = require('dockerode');

var db = require("../models");
var Container = db.container;


exports.runContainer = (req, res) => {
    var docker = new DockerSocket({ socketPath: '/var/run/docker.sock' });
    var container = docker.getContainer(req.params.id);
    // random number between 20000 and 60000
    var portNumber = Math.floor(Math.random() * (60000 - 20000 + 1)) + 20000;
    var port;
    // get exposed port in mongo database
    const containers = Container.find({ name_container: req.params.id }, { port: 1, _id: 0 })
        .then(data => {port = data[0].port})
        .catch(err => {res.status(500).json({ "response": "Error fetching container" })});
    

    // Run container and forward port
    docker.run(req.params.id, [], process.stdout, {
        Tty: true,
        OpenStdin: true,
        StdinOnce: true,
        HostConfig: {
            PortBindings: {
                '22/tcp': [{
                    "HostPort": String(portNumber)
                }]
            }
        }
    }, function (err, data, container) {
        if(err) {
            console.log("Error starting container, Container not Found !");
            res.status(500).json({ "error": "Container not found" });
        }
    }).on('container', function (container) {
        console.log("Container created, ID : " + container.id);
    }).on('start', function (container) {
        console.log("Container started, ID : " + container.id);
        res.status(200).json({ "port": portNumber });
    }).on('error', function (err) {
        console.log("Error : " + err);
    });
}

exports.stopContainer = (req, res) => {
    var docker = new DockerSocket({ socketPath: '/var/run/docker.sock' });
    var container = docker.getContainer(req.params.id);
    container.stop().then(function (data) {
        container.remove();
    });
    res.status(200).json({ "status": "Container stopped !" });
}



