const checker = require('../middleware/checker');

module.exports = app => {
    const dockerController = require('../controllers/docker.controller');

    const router = require("express").Router();

    router.post('/start/:id', dockerController.runContainer);
    // route to stop container
    router.post('/stop/:id', [checker.checkAdmin], dockerController.stopContainer);

    router.post('/running', [checker.checkAdmin], dockerController.getRunningContainers);

    app.use('/api/docker', router);
}