function GameManagerServer(PORT, PLAYERS_ALOUD) {
	this.PORT = PORT;
	this.PLAYERS_ALOUD = PLAYERS_ALOUD;

	this.teams = ['team1', 'team2'];

	this.players = [];

	this.currentTeam = this.teams[0];
}
GameManagerServer.prototype = {
	join : function (player) {
		player.team = this.currentTeam;
		
		this.players.push(player);

		if(this.players.length / 2 >= this.PLAYERS_ALOUD / 2)
			this.currentTeam = this.teams[1];
	},
	init : function () {
		// characterManager.init();
		// mapManagerServer.init();
	}
}
module.exports = GameManagerServer;
