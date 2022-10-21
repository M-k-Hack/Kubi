

exports.runContainer = (req, res) => {

    // random number between 20000 and 60000
    var port = Math.floor(Math.random() * (60000 - 20000 + 1)) + 20000;

    // Run container and forward port
    docker.run('mail-privesc', [], process.stdout, {
        Tty: true,
        OpenStdin: true,
        StdinOnce: true,
        ExposedPorts: {
            '22/tcp': {}
        },
        HostConfig: {
            PortBindings: {
                '22/tcp': [{
                    "HostPort": String(port)
                }]
            }
        }
    }, function (err, data, container) {
        if (data != null) {
            console.log("Container not started");
            res.status(500).json({ "error": "Container not started" });
        }
        console.log("Closed Container, Status code : " + data.StatusCode);
    }).on('container', function (container) {
        console.log("Container created, ID : " + container.id);
    }).on('start', function (container) {
        console.log("Container started, ID : " + container.id);
    }).on('error', function (err) {
        console.log("Error : " + err);
    });
}