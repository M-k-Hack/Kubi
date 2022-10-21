const dockerController = require('../controllers/docker.controller');

module.exports = app => {

    const router = require("express").Router();

    app.get('/start', dockerController.runContainer);

    app.use('/api/docker', router);
}