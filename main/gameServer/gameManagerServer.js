define("gameServer/gameManagerServer", [
		'core/emitter',
		"core/props",
		'gameServer/playerManagerServer',
		'gameServer/mapManagerServer'
	], function (emitter, props, playerManagerServer, mapManagerServer) {
	function GameManagerServer(io, PLAYERS_ALOUD, db) {
		this.io = io;
		this.db = db;
		this.PLAYERS_ALOUD = parseInt(PLAYERS_ALOUD);

		this.totalPlayers = 0;
		this.readyPlayers = 0;

		this.playersWaitingToStart = [];
	}
	GameManagerServer.prototype = {
		init : function () {
			emitter.on('tick', this.tick.bind(this));
		},
		start : function (socket) {
			this.readyPlayers++;
			this.addPlayerWaiting(socket.account);

			this.db.setStarted(socket.request, function () {
				this.io.emit('matchMaking', this.playersWaitingToStart.map(function (v) {
					return {
						username : v.username.toUpper(), 
						character : v.character.toUpper(), 
						team : v.team
					};
				}));

				if(this.readyPlayers === this.PLAYERS_ALOUD)
					this.io.emit('startGame');	
				
			}.bind(this));
		},
		join : function () {
			this.totalPlayers++;

			if(this.totalPlayers === this.PLAYERS_ALOUD)
				this.io.emit('instanceFull');	
		},
		addPlayerWaiting : function (player) {
			for(var i = 0; i < this.playersWaitingToStart.length; i++){
				if(this.playersWaitingToStart[i].username === player.username){
					this.playersWaitingToStart[i] = player;
					return;
				}
			}
			this.playersWaitingToStart.push(player);
			return;
		},
		leave : function (player) {
			this.totalPlayers--;
			this.readyPlayers--;
			// playerManagerServer.leave(player);
		},
		tick : function () {
			playerManagerServer.tick();
			mapManagerServer.tick();
		}
		
	}
	return GameManagerServer;
});