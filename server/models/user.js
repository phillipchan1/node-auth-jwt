// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = mongoose.model('User', new Schema({
	name: String,
	password: String,
	admin: Boolean
}));

module.exports = User;