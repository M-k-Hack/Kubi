const checker = require('../middleware/checker');

module.exports = app => {
    const dockerController = require('../controllers/docker.controller');

    const router = require("express").Router();

    router.get('/start/:id', dockerController.runContainer);
    // route to stop container
    router.get('/stop/:id', [checker.checkAdmin], dockerController.stopContainer);

    app.use('/api/docker', router);
}