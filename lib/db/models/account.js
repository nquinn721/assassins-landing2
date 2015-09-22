var mongoose = require('mongoose'),
	bcrypt = require('mongoose-bcrypt');

var Schema = mongoose.Schema;
var model = new Schema({
	username : String,
	password : String,
	firstName : String,
	lastName : String,
	email : String,
	xp : {
		type : Number,
		default : 0
	},
	characters : Object,
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