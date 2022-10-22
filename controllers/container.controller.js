const db = require("../models");
const Container = db.container;


exports.findAll = (req, res) => {
    // Find containers, just name and name_container

    const containers = Container.find({}, { name: 1, name_container: 1, _id: 0})
        .then(data => {res.status(200).json({ "response": data })})
        .catch(err => {res.status(500).json({ "response": "Error fetching container" })});
}