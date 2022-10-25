const { authJwt } = require("../middlewares");

module.exports = app => {
    const dockerController = require('../controllers/docker.controller');

    const router = require("express").Router();

    router.post('/start/:id', [authJwt.verifyToken], dockerController.runContainer);
    // route to stop container
    router.post('/stop/:id', [authJwt.verifyToken, authJwt.isAdmin], dockerController.stopContainer);

    router.get('/running', [authJwt.verifyToken, authJwt.isAdmin], dockerController.getRunningContainers);

    router.post('/build', dockerController.buildContainer);

    router.get('/images', [authJwt.verifyToken, authJwt.isAdmin], dockerController.getAllImages);

    app.use('/api/docker', router);
}