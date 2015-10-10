function GameManagerServer(io, PLAYERS_ALOUD) {
	this.io = io;
	this.PLAYERS_ALOUD = PLAYERS_ALOUD;

	this.players = [];
}
GameManagerServer.prototype = {
	join : function (player) {
		this.players.push(player);

		console.log(this.players.length, this.PLAYERS_ALOUD);
		if(this.players.length === this.PLAYERS_ALOUD)
			this.io.emit('instanceFull');	
	}
}
module.exports = GameManagerServer;
