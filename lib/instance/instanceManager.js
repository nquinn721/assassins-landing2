var Instance = require('./instance');

function InstanceManager () {

	this.currentInstance;
	this.instances = [];
}
InstanceManager.prototype = {
	instance : function (req) {
		var ip = req.connection.remoteAddress;

		// Check if full
		if(this.currentInstance && this.currentInstance.full()){
			this.instances.push(this.currentInstance);
			this.currentInstance = null;
		}

		// Create instance and join
		if(!this.currentInstance){
			var i = new Instance;
			i.create(this.instances.length);
			i.join(ip);
			this.currentInstance = i;
		}else{
			this.currentInstance.join(ip);
		}
	}
}
module.exports = new InstanceManager;