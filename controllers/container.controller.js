const db = require("../models");
const Container = db.container;


exports.findAll = (req, res) => {
    // find ALl containers mongodb
    const containers = Container.find()
        .then(data => {res.status(200).json({ "response": data })})
        .catch(err => {res.status(500).json({ "response": "Error fetching container" })});
}