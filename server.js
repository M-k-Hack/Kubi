const express = require('express')
const bodyParser = require('body-parser')
const dockerModel = require('./models/docker.model');

const app = express()
const port = 3000


// mis config
app.use(express.json())
app.use(bodyParser.json());
app.use(express.static(__dirname + '/front'))
app.use(express.static(__dirname + '/admin'))

// Model db
const db = require("./models");
const Container = db.container;
const Role = db.role;

// configdb
const dbConfig = require("./config/db.config.js");

// Connect to db
db.mongoose
.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
  user: dbConfig.USER,
  pass: dbConfig.PASSWORD,
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  initial();
  console.log("Successfully connect to MongoDB.");
})
.catch(err => {
  console.error("Connection error", err);
  process.exit();
});


// get docker routes
require("./routes/docker.route.js")(app);
require("./routes/container.route.js")(app);
require("./routes/auth.route.js")(app);
require("./routes/user.route.js")(app);

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
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}

// Kontainer Unified By Internet
