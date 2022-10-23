const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const dockerModel = require('./models/docker.model');

const app = express()
const port = 3000


// mis config
app.use(express.json());
app.use(bodyParser.json());
app.use(fileUpload());
app.use(express.static(__dirname + '/front'));
app.use(express.static(__dirname + '/admin'));

// Model db
const db = require("./models");
const Container = db.container;

// configdb
const dbConfig = require("./config/db.config.js");
const { checkAdmin } = require('./middleware/checker');

// Connect to db
db.mongoose
.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
  user: dbConfig.USER,
  pass: dbConfig.PASSWORD,
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("Successfully connect to MongoDB.");
})
.catch(err => {
  console.error("Connection error", err);
  process.exit();
});


// get docker routes
require("./routes/docker.route.js")(app);
require("./routes/container.route.js")(app);

// Run backgournd task to delete expired containers
setInterval(dockerModel.deleteExpiredContainer.bind(null, 60), 60000);


// Send front
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/front/index.html');
})

app.get('/admin', (req, res) => {
  res.sendFile(__dirname + '/admin/admin.html');
})

// start server
app.listen(port, "0.0.0.0", () => {
  console.log(`MAK'HACK Docker Orchestrer Express App on port ${port}`)
});

function initial() {
  Container.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Container({
        name: "Challenge 1 : Mail-Privesc",
        name_container: "mail-privesc",
        exposed_port: 22
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
      });

      new Container({
        name: "Challenge 2 : Web-Privesc",
        name_container: "web-privesc",
        exposed_port: 80
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
      });
    }
  });
}

// Kontainer Unified By Internet
