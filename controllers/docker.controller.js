var DockerSocket = require('dockerode');

var db = require("../models");
var Container = db.container;


exports.runContainer = (req, res) => {
    var docker = new DockerSocket({ socketPath: '/var/run/docker.sock' });
    var container = docker.getContainer(req.params.id);
    var port;
    var portNumber = Math.floor(Math.random() * (60000 - 20000 + 1)) + 20000;
    // get list of port used by docker
    docker.listContainers(function (err, containers) {
        var ports = [];
        containers.forEach(function (containerInfo) {
            containerInfo.Ports.forEach(function (port) {
                ports.push(port.PublicPort);
            });
        });
        // check if port is already used
        while (ports.includes(portNumber)) {
            portNumber = Math.floor(Math.random() * (60000 - 20000 + 1)) + 20000;
        }
        Container.findOne({ name_container: req.params.id }, function (err, container) {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            port = container.exposed_port;
            console.log(container);
            docker.run(req.params.id, [], process.stdout, {
                Tty: true,
                OpenStdin: true,
                StdinOnce: true,
                ExposedPorts: {
                    [port.toString() + "/tcp"]: {}
                },
                HostConfig: {
                    PortBindings: {
                        [port.toString()+"/tcp"]: [{ "HostPort": portNumber.toString() }]
                    }
                }
            }, function (err, data, container) {
                if(err) {
                    console.log("Error running container : " + err);
                    //console.log(port)
                    console.log(portNumber)
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
        });
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
        res.status(200).json({ "response": containers });
    });
}

// Get All Images
exports.getAllImages = (req, res) => {
    var docker = new DockerSocket({ socketPath: '/var/run/docker.sock' });
    docker.listImages(function (err, images) {
        res.status(200).json({ "response": images });
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

