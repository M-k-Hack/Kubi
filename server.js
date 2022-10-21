var Docker = require('dockerode');
const express = require('express')

var docker = new Docker({ socketPath: '/var/run/docker.sock' });
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/docker', (req, res) => {

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
          "HostPort": "36000"
        }]
      }
    }
  }, function (err, data, container) {
    if(data != null) {
      console.log("Container not started");
      res.status(500).json({"error": "Container not started"});
    }
    console.log("Closed Container, Status code : " + data.StatusCode);
  }).on('container', function (container) {
    console.log("Container created, ID : " + container.id);
  }).on('start', function (container) {
    console.log("Container started, ID : " + container.id);
  }).on('error', function (err) {
    console.log("Error : " + err);
  });


  res.status(200).json({"status": "Container started"});
});



setInterval(() => { // close all container after 1 hour
  docker.listContainers(function (err, containers) {
    containers.forEach(function (containerInfo) {
      if (containerInfo.Created < (Date.now() / 1000 - 60*60)) {
        var container = docker.getContainer(containerInfo.Id);
        console.log("closing container " + containerInfo.Id);
        container.stop().then(function (data) {
          container.remove();
        });
      }
    });
  });
}, 1000 * 300);


app.listen(port, () => {
  console.log(`Docker orchestrer app on port : ${port}`)
});


