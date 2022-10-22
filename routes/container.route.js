module.exports = app => {
    const containerController = require('../controllers/container.controller');

    const router = require("express").Router();

    router.get('/', containerController.findAll);

    app.use('/api/container', router);
}