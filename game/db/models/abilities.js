var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function(){

	var model = new Schema({
		name : String
	});
	global.Abilities = mongoose.model('Abilities', model);
}