var exec = require('child_process').exec;
var rabbit = require(process.cwd() + '/lib/instance/rabbit');

function Instance () {
	this.playersAloudInInstance = 2;
	this.totalPlayers = 0;
	this.port = 3001;
}

Instance.prototype = {
	create : function (id) {
		console.log('creating instance', id, this.port);
		this.id = id;
		exec('node ' + process.cwd() + '/server/lib/gameServer.js -p ' + this.port);
	},
	join : function (ip) {
		var self = this;
		this.totalPlayers++;

		Session.findOne({ip : ip}, function (err, acc) {
			acc.instance = self.id;
			acc.save(function () {
				rabbit.send('instance-' + self.port);
			});
		});
	},
	full : function () {
		
	}
}

module.exports = Instance;