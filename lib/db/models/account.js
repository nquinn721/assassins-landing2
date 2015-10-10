var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	bcrypt = require('mongoose-bcrypt');

var model = new Schema({
	username : {
		type : String,
		unique : true,
		required : true,
		index : true
	},
	password : {
		type : String,
		required : true
	},
	firstName : String,
	lastName : String,
	email : String,
	totalGames : {
		type : Number,
		default : 0
	},
	gamesWon : {
		type : Number,
		default : 0
	},
	gamesLost : {
		type : Number,
		default : 0
	},
	xp : {
		type : Number,
		default : 0
	},
	characters : [{ type:String, ref:"Character" }],
	gold : {
		type : Number,
		default : 0
	},
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
model.methods.userUpper = function () {
	return this.username.substr(0,1).toUpperCase() + this.username.substr(1);
}
model.plugin(bcrypt);

global.Account = mongoose.model('Account', model);
module.exports = model