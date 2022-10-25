module.exports = app => {
    const containerController = require('../controllers/images.controller');

    const router = require("express").Router();

    router.get('/', containerController.findAll);
    router.post('/create', containerController.create);

    app.use('/api/images', router);
}