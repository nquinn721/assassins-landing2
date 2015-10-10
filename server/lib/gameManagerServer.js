function GameManagerServer(io, PLAYERS_ALOUD) {
	this.io = io;
	this.PLAYERS_ALOUD = parseInt(PLAYERS_ALOUD);

	this.players = [];
}
GameManagerServer.prototype = {
	join : function (player) {
		this.players.push(player);

		console.log(this.players.length, this.PLAYERS_ALOUD);
		if(this.players.length === this.PLAYERS_ALOUD)
			this.io.emit('instanceFull');	
	},
	leave : function (player) {
		this.players.splice(this.players.indexOf(player), 1);
	},
	showMatchMaking : function () {
		this.io.emit('matchMaking', this.players.map(function (v) {
			return {username : v.username, character : v.character};
		}));
	}
}
module.exports = GameManagerServer;
