var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function(){

	var model = new Schema({
		hp : String,
		name : String,
		abilities : Object,
		def : Number,
		att : Number,
		spd : Number
	});

	global.Characters = mongoose.model('Characters', model);
};