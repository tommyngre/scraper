//PACKAGES
var express = require("express");
var hbs = require("express-handlebars");
var bodyParser = require("body-parser");
//var logger = require("morgan");
var mongoose = require("mongoose");

//DB MODELS
var db = require("./models");

//INIT SERVER, ROUTES, MIDDLEWARE
var PORT = process.env.PORT || 3000;


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

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());

app.use(express.static("public"));

require('./routes/gets.js')(app);
require('./routes/posts.js')(app);

//handles form submissions
app.use(bodyParser.urlencoded({ extended: true }));

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scraper";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

//connect to mongoose
db.on('error', function(err){
  console.log('Mongoose Error: ',err);
})
db.once('open',function(){
  console.log('Mongoose connection successful.')
})

//start server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});