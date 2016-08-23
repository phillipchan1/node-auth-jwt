'use strict';

var express = require('express');
var app = express();
var router = express.Router();
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../../config.js')

app.set('superSecret', config.secret); // secret variable

router.get('/setup', function(req, res) {

  // create a sample user
  var nick = new User({ 
  	name: 'Phil Cerminara', 
  	password: 'password',
  	admin: true 
  });

  // save the sample user
  nick.save(function(err) {
  	if (err) throw err;

  	console.log('User saved successfully');
  	res.json({ success: true });
  });
});

// authenticate
router.post('/authenticate', function(req, res) {
	// find the user
	// findOne is a mongoose method for a collection
	User.findOne({
		name: req.body.user
	}, function(err, user) {

		// if user is not found
		if (!user) {
			res.json({
				success: false,
				message: 'Error: user not found'
			});
		}

		// if no password is given
		else if (!req.body.password) {
			res.json({
				success: false,
				message: 'Yo enter a password'
			});
		}

		// if password is not correct
		else if (req.body.password !== user.password) {
			res.json({
				success: false,
				message: 'Error: pw not correct'
			});

		// if user is found and password is right
	    // create a token
	} else {	

	        // from docs:
	        // jwt.sign(payload, secretOrPrivateKey, options, [callback])
	        var token = jwt.sign(
	        	user._id, 
	        	app.get('superSecret'),
	        	{
	        		expiresIn: "600000"
	        	}
	        	);

	        res.json({
	        	success: true,
	        	message: 'Enjoy your token!!!!',
	        	token: token
	        });

	    }
	});
});

// application middleware to see if a token exists
router.use(function(req, res, next) {
	console.log(req.headers);

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.token;

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
    	if (err) {
    		return res.json({ success: false, message: 'Failed to authenticate token.', error: err });    
    	} else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
    }
});

} else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
    	success: false, 
    	message: 'No token provided.' 
    });
    
}
});

router.get('/', function(req, res) {
	console.log(req);
	res.send('Hello! The API is at http://localhost:3000/api');
});

router.get('/users', function(req, res) {
	User.find({}, function(err, users) {
		res.json(users);
	});
});   

module.exports = router;