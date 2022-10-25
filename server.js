const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');

const dockerModel = require('./models/docker.model');
const { authJwt } = require("./middlewares");

const app = express()
const port = 3000


// mis config
app.use(express.json());
app.use(bodyParser.json());
app.use(fileUpload());
app.use(express.static(__dirname + '/public/'));
app.use(cookieParser());


app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);


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
  console.log("Successfully connect to MongoDB.");
})
.catch(err => {
  console.error("Connection error", err);
  process.exit();
});


// get docker routes
require("./routes/docker.route.js")(app);
require("./routes/images.route.js")(app);
require("./routes/auth.route.js")(app);
require("./routes/user.route.js")(app);

// Run backgournd task to delete expired containers
setInterval(dockerModel.deleteExpiredContainer.bind(null, 60), 60000);


app.get('/login', (req, res) => {
  res.render('login.html');
})

app.get('/admin',[authJwt.verifyToken, authJwt.isAdmin], (req, res) => {
  res.render('admin.html');
})

// Send front
app.get('/', [authJwt.verifyToken], (req, res) => {
  res.render('main.html');
  // res.sendFile(__dirname + '/front/index.html');
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
