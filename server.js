const express = require('express')
const bodyParser = require('body-parser')
const dockerModel = require('./models/docker.model');

const app = express()
const port = 3000


// mis config
app.use(express.json())
app.use(bodyParser.json());

// get docker routes
require("./routes/docker.route.js")(app);

// Run backgournd task to delete expired containers
setInterval(dockerModel.deleteExpiredContainer.bind(null, 60), 60000);

app.get('/', (req, res) => {
  res.sendFile(__dirname + './front/index.html');
})

app.listen(port,"127.0.0.1", () => {
  console.log(`MAK'HACK Docker Orchestrer Express App on port ${port}`)
});


// Kontainer Unified By Internet
