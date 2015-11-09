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
			players = Number(req.query.players),
			self = this;
			
		// Check if full
		if(this.currentInstance && this.currentInstance.full()){
			this.instances.push(this.currentInstance);
			this.currentInstance = null;
		}

		// Create instance and join
		if(!this.currentInstance){
			this.createNew(cookie, players, cb);
		}else{
			var request = http.request({host: 'ec2-54-165-181-175.compute-1.amazonaws.com', port : this.currentPort }, function () {
				if(self.currentInstance.playersAloudInInstance === players)
					self.currentInstance.join(cookie, cb);
				else self.createNew(cookie, players, cb);
			});
			request.on('error', function (err) {
				self.createNew(cookie, players, cb);
			});
			request.end();
		}
	},
	createNew : function (cookie, players, cb) {
		this.currentPort++;
		var i = new Instance(this.currentPort, this.db, this, players);
		
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