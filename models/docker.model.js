// TODO
var DockerSocket = require('dockerode');
class Docker {
    
    deleteExpiredContainer(timeInMinutes) {
        var docker = new DockerSocket({ socketPath: '/var/run/docker.sock' });
        docker.listContainers(function (err, containers) {
            containers.forEach(function (containerInfo) {
                if (containerInfo.Created < (Date.now() / 1000 - timeInMinutes * 60)) {
                    var container = docker.getContainer(containerInfo.Id);
                    console.log("closing container " + containerInfo.Id);
                    container.stop().then(function (data) {
                        container.remove();
                    });
                }
            });
        });
    }
}

module.exports = new Docker();