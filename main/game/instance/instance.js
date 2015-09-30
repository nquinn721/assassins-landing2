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
		
		// Players
		this.totalPlayers = 0;
		this.playersAloud = 2;
		this.waitingPlayers = [];
		this.playerInstance = new PlayerInstance(this.id, this.b2d);
		this.mapInstance = new MapInstance(this.id, this.b2d, obj.map);

		

		// Parent
		this.instanceManager = instanceManager;
	}

	Instance.prototype = {
		init : function () {
			emitter.on('serverTick', this.tick.bind(this));
		},
		full : function () {
			if(this.totalPlayers >= this.playersAloud)
				return true;
		},
		matchMaking : function (io) {
			io.in(this.id).emit('matchMaking', this.playerInstance.players.map(function(v){return { name : v.account.username, character : v.characterClass.stats.character, team : v.team}}));

			if(this.full()){
				for(var i = 0; i < this.waitingPlayers.length; i++)
					this.updatePlayersAndStartMatch(this.waitingPlayers[i].socket, this.waitingPlayers[i].user);
			}

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


			this.setSpawnPoint(socket.player);
			this.playerInstance.add(socket.player);
			this.waitingPlayers.push({socket : socket, user : socket.player.obj()});
			
			this.matchMaking(io);
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
		 		items = this.map.items.map(function(v){return v.obj()});

			socket.emit('start', {map : items, players : players, user : user, mapName : this.mapName});
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
		emitToPlayer : function (io, player, event, data) {
			if(player && io.sockets.connected[player.socketId])
				io.sockets.connected[player.socketId].emit(event, data);
		}
	}

	return Instance;
});