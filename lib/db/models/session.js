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
	character : String
});
global.Session = mongoose.model('Session', model);
