const express = require('express')
const bodyParser = require('body-parser')
const dockerModel = require('./models/docker.model');

const app = express()
const port = 3000


//config diverses
app.use(express.json())
app.use(bodyParser.json());

require("./routes/docker.route.js")(app);

// Run backgournd task to delete expired containers
setInterval(dockerModel.deleteExpiredContainer.bind(null, 60), 60000);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port,"127.0.0.1", () => {
  console.log(` MAK'HACK Docker Orchestrer Express App on port : ${port}`)
});


// Kontainer Unified By Internet