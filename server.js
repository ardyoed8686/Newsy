
var logger = require("morgan");
var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var axios = require("axios");


// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

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

app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// Connect to the Mongo DB

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);



// Routes

// route to scrape articles
app.get("/scrape", function(req, res) {
	// First, we grab the body of the html with axios
	axios.get("https://www.nytimes.com/section/world")
	.then(function(response) {
	  var $ = cheerio.load(response.data);
	  $(".css-ye6x8s .css-1cp3ece .css-1l4spti").each(function(i, element) {
	   
		var result = {};
		result.title = $(this).find("a").find("h2.css-1j9dxys").text().trim();
		result.link = $(this).find("a").attr("href");
		
		result.summary = $(element).find("a").find("p.css-1echdzn").text().trim();
		console.log(result);
  
		// Create a new Article using the `result` object built from scraping
		db.Article.create(result)
		  .then(function(dbArticle) {
			// View the added result in the console
			console.log(dbArticle);
		  })
		  .catch(function(err) {
			// If an error occurred, log it
			console.log(err);
		  });
	  });
  
	  // Send a message to the client
	  res.send("Scrape Complete");
	  res.redirect("/");
	});
});

app.get("/", function(req, res) {
	db.Article.find({}, null, {sort: {created: -1}}, function(err, data) {
		if(data.length === 0) {
			res.render("home", {message: "Nothing scraped yet. Please click \"Scrape New Articles\" for new listings."});
		}
		else{
			res.render("home", {articles: data});
		}
	});
});



app.get("/saved", function(req, res) {
	db.Article.find({issaved: true}, null, {sort: {created: -1}}, function(err, data) {
		if(data.length === 0) {
			res.render("home", {message: "You have not saved any articles yet. Try saving some articles by clicking \"Save Article\"!"});
		}
		else {
			res.render("saved", {saved: data});
		}
	});
});

app.get("/articles/:id", function(req, res) {
	db.Article.findOne({_id: req.params.id}, function(err, data) {
		res.json(data);
	});
});

app.post("/articles/:id", function(req, res) {
	db.Note.create(req.body)
	.then(function (dbNote) {
	  return db.Article.findOneAndUpdate({}, {$set: { note: dbNote._id} }, { new: true });
	})
	.then(function (dbArticle) {
	  res.json(dbArticle);
	})
	.catch(function (err) {
	  res.json(err);
	});
});

app.get("/articles/:id", function(req, res) {
	db.Article.findOne({_id: req.params.id})
	.populate("note")
	.then(function (dbArticle) {
	  res.json(dbArticle);
	})
	.catch(function (err) {
	  res.json(err)
	});
});


// Start the server
app.listen(PORT, function() {
	console.log("Listening on port:" + PORT);
});