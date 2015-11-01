var Instance = require('./instance'),
	http = require('http');

function InstanceManager () {
	this.currentInstance;
	this.currentPort = 3000;
	this.instances = [];
}
InstanceManager.prototype = {
	init : function (db, io) {
		this.db = db;
		this.io = io;
	},
	instance : function (req, cb) {
		var cookie = req.cookies.al,
			self = this;
		
		// Check if full
		if(this.currentInstance && this.currentInstance.full()){
			this.instances.push(this.currentInstance);
			this.currentInstance = null;
		}

		// Create instance and join
		if(!this.currentInstance){
			this.createNew(cookie, cb)
		}else{
			var request = http.request({host: 'localhost', port : this.currentPort }, function () {
				self.currentInstance.join(cookie, cb);
			});
			request.on('error', function (err) {
				self.createNew(cookie, cb);
			});
			request.end();
		}
	},
	createNew : function (cookie, cb) {
		this.currentPort++;
		var i = new Instance(this.currentPort, this.db, this);
		
		this.currentInstance = i;
		i.create(cookie, cb);
	},
	leave : function (instance, team) {
		for(var i = 0; i < this.instances.length; i++)
			if(this.instances[i].port === instance)this.instances[i].leave(team);
		
	},
	exitInstance : function (instance) {
		this.instances.splice(this.instances.indexOf(instance), 1);

		this.io.in(instance.port).emit('end');

	}
}
module.exports = new InstanceManager;