var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var model = new Schema({
	users : Object,
	winPlayers : String,
	losePlayers : String,
	createAt : {
		type : Date,
		default : Date.now
	},
	updateAt : {
		type : Date
	},
	deletedAt : {
		tepe : Date
	},

});

global.Game = mongoose.model('Game', model);
module.exports = model