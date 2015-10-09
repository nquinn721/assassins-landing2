var mongoose = require('mongoose');
	Schema = mongoose.Schema;

var model = new Schema({
	account : Object,
	cookie : {
		type : String,
		index : true
	},
	instance : String
});
global.Session = mongoose.model('Session', model);
