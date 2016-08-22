var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:3000/api');
});

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

router.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});   

router.post('/authenticate', function(req, res) {
	// find the user
	console.log(req.body);
	// findOne is a mongoose method for a collection
	User.findOne({
		name: req.body.user
	}, function(err, user) {
	
		// if there are no users
		if (!user) {
			res.json({
				success: false,
				message: 'Error: user not found'
			});
		}

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
			
		} else {
			res.json(user);
		}
	});
});

module.exports = router;