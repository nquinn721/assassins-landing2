define("gameServer/gameManagerServer", [
		'core/emitter',
		"core/props",
		'gameServer/playerManagerServer',
		'gameServer/mapManagerServer',
		'game/map/map',
		'core/b2d'
	], function (emitter, props, playerManagerServer, mapManagerServer, Map, b2d) {
	function GameManagerServer(io, PLAYERS_ALOUD, db) {
		this.io = io;
		this.db = db;
		this.PLAYERS_ALOUD = parseInt(PLAYERS_ALOUD);
		this.mapName = 'map1';
		this.map = new Map(this.mapName, b2d);
		this.map.init();

		this.totalPlayers = 0;
		this.readyPlayers = 0;

		this.playersWaitingToStart = [];

		this.gameStarted = false;
	}
	GameManagerServer.prototype = {
		init : function () {
			emitter.on('tick', this.tick.bind(this));
			playerManagerServer.init(this);
		},
		start : function (socket) {
			if (this.gameStarted)
				this.resumeGame(socket);
			else if(!socket.account.started)this.startNewGame(socket);
			else this.resumeReady(socket);

		},
		resumeGame : function (socket) {
			socket.emit('matchMaking', playerManagerServer.players.map(function (v) {
				return {
					username : v.username.toUpper(), 
					character : v.character.toUpper(), 
					team : v.team
				};
			}));
			socket.emit('startGame');
			playerManagerServer.sendToClient(socket, true);
			setTimeout(function () {
				socket.emit('showViewport');					
			}, 10000);
		},
		resumeReady : function (socket) {
			socket.emit('matchMaking', playerManagerServer.players.map(function (v) {
				return {
					username : v.username.toUpper(), 
					character : v.character.toUpper(), 
					team : v.team
				};
			}));

			if(this.beginLoading){
				socket.emit('startGame');
				playerManagerServer.sendToClient(socket, true);
			}
		},
		startNewGame : function (socket) {
			var self = this;


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
				
				playerManagerServer.create(socket);
				console.log('ready', this.readyPlayers, 'total', this.totalPlayers, 'aloud', this.PLAYERS_ALOUD);
				if(this.readyPlayers === this.totalPlayers && this.readyPlayers === this.PLAYERS_ALOUD){
					this.io.emit('startGame');	
					playerManagerServer.sendToClient(this.io);
					this.beginLoading = true;
					setTimeout(function () {
						self.gameStarted = true;
						self.io.emit('showViewport');
					}, 10000);
				}
				
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
			// this.readyPlayers--;
			console.log('leave ready players', this.readyPlayers);
			playerManagerServer.leave(player);
		},
		tick : function () {
			playerManagerServer.tick();
			mapManagerServer.tick();
		}
		
	}
	return GameManagerServer;
});