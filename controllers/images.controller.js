const db = require("../models");
const Container = db.container;


exports.findAll = (req, res) => {
    // Find containers, just name and name_container

    const containers = Container.find({}, { name: 1, name_container: 1, _id: 0})
        .then(data => {res.status(200).json({ "response": data })})
        .catch(err => {res.status(500).json({ "response": "Error fetching container" })});
}

exports.create = (req, res) => {
    // Create a container
    const container = new Container({
        name: req.body.name,
        name_container: req.body.name_container,
        image_id: req.body.image_id,
        exposed_port: req.body.exposed_port
    });

    container.save((err, container) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        res.status(200).json({ "response": "Container created" });
    });
}