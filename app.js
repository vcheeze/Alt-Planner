//Set up requirements
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var Request = require('request');
var _=require('underscore');

//Create an 'express' object
var app = express();

//Some Middleware - log requests to the terminal console
app.use(logger('dev'));

//Set up the views directory
app.set("views", __dirname + '/views');
//Set EJS as templating language WITH html as an extension
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
//Add connection to the public folder for css & js files
app.use(express.static(__dirname + '/public'));
// Enable json body parsing of application/json
app.use(bodyParser.json());


var cloudant_USER = 'vcheeze';
var cloudant_DB = 'alt-planner';
var cloudant_KEY = 'candessomealissistrachor';
var cloudant_PASSWORD = '04f27c76ea2ab33154ec4f5637a433dfdff41356';

var cloudant_URL = "https://" + cloudant_USER + ".cloudant.com/" + cloudant_DB;


/*================== ROUTES ==================*/
// CORS enable routes
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});


// Landing page route
app.get("/", function(req, res) {
	res.render("index");
});


// Documentation route
app.get("/about", function(req, res) {
	res.render("about");
});


app.get("/api", function(req,res) {
	console.log('Making a DB request for all entries');
	//Use the Request lib to GET the data in the CouchDB on Cloudant
	Request.get({
		url: cloudant_URL+"/_all_docs?include_docs=true",
		auth: {
			user: cloudant_KEY,
			pass: cloudant_PASSWORD
		},
		json: true
	},
	function (error, response, body) {
		var theRows = body.rows;
		var theData = _.map(theRows, function(o) { return o.doc; });

		//Send the data
		res.json(theData);
	});
});


//SAVE an object to the db
app.post("/save", function(req,res) {
	console.log("A POST!!!");
	//Get the data from the body: the body is the data that is sent from the client to the server
	var data = req.body;
	console.log(data);
	//Send the data to the db
	Request.post({
		url: cloudant_URL,
		auth: {
			user: cloudant_KEY,
			pass: cloudant_PASSWORD
		},
		json: true,
		body: data
	},
	function (error, response, body) {
		if (response.statusCode == 201) {
			console.log("Saved!");
			res.json(body);
		}
		else {
			console.log("Uh oh...");
			console.log("Error: " + res.statusCode);
			res.send("Something went wrong...");
		}
	});
});


// JSON serving route
app.get("/api/:city", function(req, res) {
	var cityName = req.params.city;
	var embedded = "&limit=1&embed=city:search-results/city:item/city:urban_area/ua:scores";
	var requestURL = "https://api.teleport.org/api/cities/?search=" + cityName + embedded;
	Request(requestURL, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			//console.log(body);
			var priceData = JSON.parse(body);
			//send all the data
			res.json(priceData);
		}
	});
});


app.get("/api/top/scores", function(req,res) {
	console.log("DB request for top scores.");
	//Use the Request lib to GET the data in the CouchDB on Cloudant
	Request.get({
		url: cloudant_URL+"/_all_docs?include_docs=true",
		auth: {
			user: cloudant_KEY,
			pass: cloudant_PASSWORD
		},
		json: true
	},
	function (error, response, body) {
		var theRows = body.rows;

		var theData = _.map(theRows, function(o) { return o.doc; });
		theData = _.map(theData, function(o) { return _.pick(o, ['city', 'score']); });
		theData = _.sortBy(theData, function(o) { return -o.score; });

		//Send the data
		res.json(theData);
	});
});


app.get("/api/top/search", function(req,res) {
	console.log("DB request for top search results.");
	//Use the Request lib to GET the data in the CouchDB on Cloudant
	Request.get({
		url: cloudant_URL+"/_all_docs?include_docs=true",
		auth: {
			user: cloudant_KEY,
			pass: cloudant_PASSWORD
		},
		json: true
	},
	function (error, response, body) {
		var theRows = body.rows;
		var theData = _.map(theRows, function(o) { return o.doc; });
		theData = _.map(theData, function(o) { return _.pick(o, ['city', 'count']); });
		theData = _.sortBy(theData, function(o) { return -o.count; });

		//Send the data
		res.json(theData);
	});
});


// Everything else
app.get("*", function(req, res) {
	res.send("This ain't workin' man. Check the URL and try again.");
});
/*============================================*/

// Start the server
app.listen(3000);
console.log('Express started on port 3000');