var Instance = require('./instance');

function InstanceManager () {
	this.currentInstance;
	this.currentPort = 3000;
	this.instances = [];
}
InstanceManager.prototype = {
	init : function (db) {
		this.db = db;
	},
	instance : function (req, cb) {
		var cookie = req.cookies.al;
		
		// Check if full
		if(this.currentInstance && this.currentInstance.full()){
			this.instances.push(this.currentInstance);
			this.currentInstance = null;
		}

		// Create instance and join
		if(!this.currentInstance){
			this.currentPort++;
			var i = new Instance(this.currentPort, this.db);
			i.create(cookie, cb);
			this.currentInstance = i;
		}else{
			this.currentInstance.join(cookie, cb);
		}
	}
}
module.exports = new InstanceManager;