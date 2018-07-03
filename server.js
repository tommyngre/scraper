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

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());

app.use(express.static("public"));

require('./routes/gets.js')(app);
require('./routes/posts.js')(app);

//handles form submissions
app.use(bodyParser.urlencoded({ extended: true }));

//configure connection
var databaseUri = "mongodb://localhost/scraper";

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect(databaseUri);
}

var db = mongoose.connection;

mongoose.Promise = Promise;

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