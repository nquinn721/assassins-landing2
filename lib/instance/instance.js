var spawn = require('child_process').spawn;

function Instance (port, db) {
	this.playersAloudInInstance = 4;
	this.totalPlayers = 0;
	this.port = port;

	this.finishedLoading;

	this.waiting = {};

	this.db = db;


	this.teams = ['team1', 'team2'];
	this.teamNumber = 0;

	this.players = [];
	this.teamInterval = this.playersAloudInInstance / 2;

	this.currentTeam = this.teams[this.teamNumber];
}

Instance.prototype = {
	create : function (cookie, cb) {
		var p = spawn('node', [process.cwd() + '/server/lib/gameServer.js', this.port, this.playersAloudInInstance]),
			self = this;

		p.stdout.on('data', function (data) {
			console.log('stdout: ' + data);
			data = data.toString().replace(/[\s\n]/g, '');

			if(data === 'started'){
				self.started = true;
				for(var i in self.waiting)
					self.waiting[i](self.port);
			}
		});
		p.stderr.on('data', function (data) {
			console.log('stderr: ' + data);
		});
		p.on('exit', function (code) {
			console.log('exit'+ code);
		});
		this.join(cookie, cb);
	},
	join : function (cookie, cb) {
		var self = this;

		if(this.totalPlayers % this.teamInterval === 0 && this.totalPlayers > 0){
			this.teamNumber++;
			this.currentTeam = this.teams[this.teamNumber];
		}
		this.totalPlayers++;

		this.db.setInstanceAndTeam(cookie, this.port, this.currentTeam, function () {
			if(!self.started)
				self.waiting[cookie] = cb;
			else cb(self.port);
		})
		
	},

	full : function () {
		return this.totalPlayers === this.playersAloudInInstance;
	}
}

module.exports = Instance;