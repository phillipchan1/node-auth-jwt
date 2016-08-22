// =======================
// get the packages we need 
// =======================
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config'); // get our config file
var User   = require('./models/user'); // get our mongoose model

// =======================
// configuration 
// =======================
var port = process.env.PORT || 3000; // used to create, sign, and verify tokens
mongoose.connect(config.database, function(err) {
	if (err) {
		console.error("failed to connect to db");
	} else {
		console.log("connected to db")
	}
}); // connect to database
app.set('superSecret', config.secret); // secret variable


// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// =======================
// routes 
// =======================
// 

var routes = require('./routes/index');
app.use('/api', routes);

// =======================
// starting server
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);