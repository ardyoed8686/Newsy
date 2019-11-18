
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

// Initialize Express
var app = express();

// Configure middleware
// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

// Routes

// Make a request via axios to grab the HTML body from the site of your choice
axios.get("https://www.fandango.com").then(function(response) {

  // Load the HTML into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  var $ = cheerio.load(response.data);
console.log(response.data)
  // An empty array to save the data that we'll scrape
  var results = [];