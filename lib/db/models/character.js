var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var model = new Schema({
	hp : String,
	name : {
		type : String,
		index : true
	},
	abilities : Object,
	def : Number,
	att : Number,
	spd : Number,
	agi : Number
});

global.Character = mongoose.model('Character', model);
