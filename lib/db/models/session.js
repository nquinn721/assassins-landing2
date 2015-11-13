var mongoose = require('mongoose');
	Schema = mongoose.Schema;

var model = new Schema({
	account : Object,
	cookie : {
		type : String,
		index : true
	},
	instance : String,
	team : String,
	character : String,
	started : String,
	gameStats : Object,
	socketId : String,
	idleTime : {
		type : Number,
		default : 1000 * 60 * 10
	}
});
global.Session = mongoose.model('Session', model);
