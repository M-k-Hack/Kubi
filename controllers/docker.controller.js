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

exports.getRunningContainers = (req, res) => {
    var docker = new DockerSocket({ socketPath: '/var/run/docker.sock' });
    docker.listContainers(function (err, containers) {
        console.log(containers);
        res.status(200).json({ "response": containers });
    });
}


exports.buildContainer = (req, res) => {
    var docker = new DockerSocket({ socketPath: '/var/run/docker.sock' });
    var tarStream = req.files.file.data;
    var imageName = req.body.name;
    var exposedPort = req.body.port;

    // build image from tar stream and if successfull, add it to the mongodb
    docker.buildImage(tarStream, { t: imageName }, function (err, stream) {
        if (err) {
            console.log("Error building image : " + err);
            res.status(500).json({ "error": err });
        }
        stream.pipe(process.stdout);
        stream.on('end', function () {
            console.log("Image built and stored in docker");
            // save image to mongo database
            const containers = new Container({
                name: imageName,
                name_container: imageName,
                exposed_port: exposedPort
            });
            containers.save(containers)
                .then(data => { res.status(200).json({ "response": "Image stored in database" }) })
                .catch(err => { res.status(500).json({ "response": "Error storing image in database" }) });
        });
    });
}

