var mongoose = require('mongoose');
	Schema = mongoose.Schema;

var model = new Schema({
	name : [{ type:String, ref:"Character"}]
});
global.Ability = mongoose.model('Ability', model);
