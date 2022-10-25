const mongoose = require('mongoose');

const Container = mongoose.model(
    "Container",
    new mongoose.Schema({
        name: String,
        name_container: String,
        exposed_port: Number
    })
);

module.exports = Container;