//PACKAGES
var express = require("express");
var hbs = require("express-handlebars");
var bodyParser = require("body-parser");
//var logger = require("morgan");
var mongoose = require("mongoose");

//DB MODELS
var db = require("./models");

//INIT SERVER, ROUTES, MIDDLEWARE
var PORT = 3000;

var app = express();
app.engine('handlebars', hbs({
  defaultLayout: 'main',
  helpers: {
    upperCase: function (str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
  }
}));

app.set('view engine', 'handlebars');

require('./routes/gets.js')(app);

//handles logging requests
//CHECK ON THIS
//app.use(logger("dev"));
//handles form submissions
app.use(bodyParser.urlencoded({ extended: true }));
//serve the public folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/scraper");


// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scraper";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});