
// Run `npm init`. When that's finished, install and save these npm packages:
var logger = require("morgan");
// 1. express
var express = require("express");
// 2. express-handlebars
var express = require("express-handlebars");
// 3. mongoose
var mongoose = require("mongoose");
// 4. cheerio
var cheerio = require("cheerio");
// 5. axios
var axios = require("axios");


// Mongoose

var Note = require("./models/Note");
var Article = require("./models/Article");
var databaseUrl = 'mongodb://localhost/nyt';

if (process.env.MONGODB_URI) {
	mongoose.connect(process.env.MONGODB_URI);
}
else {
	mongoose.connect(databaseUrl);
};

mongoose.Promise = Promise;
var db = mongoose.connection;

db.on("error", function(error) {
	console.log("Mongoose Error: ", error);
});

db.once("open", function() {
	console.log("Mongoose connection successful.");
});

// Initialize Express
var app = express();

var PORT = process.env.PORT || 3000;

// Configure middleware
// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static(__dirname + "/public"));

app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");




app.listen(PORT, function() {
 console.log("Listening on port:" + PORT);
});


// Routes

// Make a request via axios to grab the HTML body from the site of your choice
// axios.get("https://www..com").then(function(response) {

  // Load the HTML into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
//   var $ = cheerio.load(response.data);
// console.log(response.data)
  // An empty array to save the data that we'll scrape
  // var results = [];