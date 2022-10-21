const checkAdmin = require('../middleware/checkAdmin');

module.exports = app => {
    const dockerController = require('../controllers/docker.controller');

    const router = require("express").Router();

    router.get('/start', dockerController.runContainer);
    router.delete('/stop', [checkAdmin], dockerController.stopContainer);

    app.use('/api/docker', router);
}