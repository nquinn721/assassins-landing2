define("game/instance/instance", [
		"core/emitter", 
		"core/props",
		"core/ping",
		"core/lib/underscore",
		"game/instance/playerInstance",
		"game/instance/mapInstance"
	], function (emitter, props, ping, _, PlayerInstance, MapInstance) {

	function Instance (instanceManager, obj) {
		this.b2d = obj.b2d;
		this.mapName = obj.mapName;
		this.id = obj.id;
		this.map = obj.map;
		this.frames = 0;
		this.xpGained = 100;
		
		// Players
		this.totalPlayers = 0;
		this.playersAloud = 2;
		this.playersStarted = 0;
		this.waitingPlayers = [];
		this.playerInstance = new PlayerInstance(this, this.id, this.b2d);
		this.mapInstance = new MapInstance(this, this.id, this.b2d, obj.map);

		

		// Parent
		this.instanceManager = instanceManager;
	}

	Instance.prototype = {
		init : function (io) {
			this.io = io;
			emitter.on('serverTick', this.tick.bind(this));
		},
		full : function () {
			if(this.totalPlayers >= this.playersAloud)
				return true;
		},
		matchMaking : function (io) {
			// io.in(this.id).emit('matchMaking', this.playerInstance.players.map(function(v){return { name : v.account.username, character : v.characterClass.stats.character, team : v.team}}));

			
		},
		join : function (socket, io) {
			this.totalPlayers++;
			var base, team;


			if(this.totalPlayers > this.playersAloud / 2){
				base = 'base1';
				team = 'team2';
			}else{
				base = 'base0';
				team = 'team1';
			}

			this.playerInstance.createUser(socket, io, base, team);
			this.playerInstance.updateCharacterSelect(socket);
			// this.waitingPlayers.push({socket : socket, user : socket.player.obj()});
			this.matchMaking(io);
		},
		characterSelect : function (socket, char) {
			this.playerInstance.characterSelect(socket, char);
		},
		start : function (socket) {
			this.playerInstance.start(socket);	

			this.playersStarted++;
			if(this.playersStarted === this.playersAloud){
				this.setSpawnPoint(socket.player);
				for(var i = 0; i < this.waitingPlayers.length; i++)
					this.updatePlayersAndStartMatch(this.waitingPlayers[i].socket, this.waitingPlayers[i].user);


				io.in(this.id).emit('startGame');
			}
		},
		
		leave : function (player) {
			for(var i = 0; i < this.players.length; i++)
				if(this.players[i].id === player.id)
					this.players.splice(i, 1);

			this.totalPlayers--;

			if(this.totalPlayers === 0){
				this.instanceManager.destroyInstance(this);
			}
		},
		
		updatePlayersAndStartMatch : function (socket, user) {
			var players = _.compact(this.playerInstance.players.map(function(v){if(v.id !== socket.player.id)return v.simpleObj()})),
		 		items = this.map.items.map(function(v){return v.obj()}),
		 		self = this;
		 	socket.on('startGame', function () {
				socket.emit('start', {map : items, players : players, user : user, mapName : self.mapName});
		 	});
			this.matchStarted = true;
		},

		setSpawnPoint : function (player) {
			for(var i = 0; i < this.map.items.length; i++){
				var item = this.map.items[i];
				if(item.id ===  player.base){
					var x = item.x + (item.w / 2) - (player.w / 2),
						y = item.y + (item.h - player.h);
					player.setCoords({x : x, y : y});
					player.directionFacing = item.id === 'base0' ? 'left' : 'right';
					player.spawnPoint = {
						x : x,
						y : y
					}
				}
			}
		},
		tick : function (io) {
			this.frames++;

			this.playerInstance.tick(io);
			this.mapInstance.tick(io);
			
		},
		emitToPlayer : function (player, event, data) {
			if(player && this.io.sockets.connected[player.socketId])
				this.io.sockets.connected[player.socketId].emit(event, data);
		},
		endGame : function (winner) {
			var players = this.playerInstance.players,	
				winners = [],
				losers = [],
				self = this;

			for(var i = 0; i < players.length; i++){
				var player = players[i];
				if(player.base === winner)winners.push({id : player.account.id, socketId : player.socketId});
				else losers.push({id : player.account.id, socketId : player.socketId})
			}

			for(var i = 0; i < winners.length; i++){
				this.emitToPlayer(winners[i], 'win');
				Account.findOne({_id : winners[i].id}, function (err, acc) {
					acc.xp += self.xpGained;
					acc.save();
				});
			}

			for(var i = 0; i < losers.length; i++)
				this.emitToPlayer(losers[i], 'lose');

			this.instanceManager.destroyInstance(this);
		}
	}

	return Instance;
});