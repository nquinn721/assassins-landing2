define("game/instance/instance", [
		"core/emitter", 
		"core/props",
		"core/ping",
		"game/character/player/playerManager",
		"core/lib/underscore"
	], function (emitter, props, ping, playerManager, _) {

	function Instance (instanceManager, obj) {
		this.b2d = obj.b2d;
		this.mapName = obj.mapName;
		this.id = obj.id;
		this.map = obj.map;
		this.frames = 0;
		
		// Players
		this.totalPlayers = 0;
		this.players = [];
		this.playersAloud = 2;
		this.waitingPlayers = [];

		// Emit Coords
		this.emitCoords = false;

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
			io.in(this.id).emit('matchMaking', this.players.map(function(v){return { name : v.account.username, character : v.characterClass.stats.character, team : v.team}}));

			if(this.full()){
				for(var i = 0; i < this.waitingPlayers.length; i++)
					this.updatePlayersAndStartMatch(this.waitingPlayers[i].socket, this.waitingPlayers[i].user);
			}

		},
		join : function (socket, io) {
			this.totalPlayers++;
			var base, team;

			this.createUser(socket, io);

			if(this.totalPlayers > this.playersAloud / 2){
				base = 'base1';
				team = 'team2';
			}else{
				base = 'base0';
				team = 'team1';
			}

			socket.player.setBase(base);
			socket.player.setTeam(team);

			this.setSpawnPoint(socket.player);
			this.players.push(socket.player);
			this.waitingPlayers.push({socket : socket, user : socket.player.obj()});
			
			this.matchMaking(io);
		},
		createUser : function (socket, io) {
			var player = playerManager.createPlayer({
				socketId : socket.id, 
				username : socket.account.username, 
				characterClass : socket.account.characterClass.stats
			});
			player.init(this.b2d, socket.account.characterClass);
			// Full player class
			socket.player = player;
			socket.player.account = {
				username : socket.account.username,
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
			var players = _.compact(this.players.map(function(v){if(v.id !== socket.player.id)return v.simpleObj()})),
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
					player.directionFacing = item.id === 'base0' ? 'right' : 'left';
					player.spawnPoint = {
						x : x,
						y : y
					}
				}
			}
		},
		tick : function (io) {
			var hp = [],
				player;
			this.frames++;
			
			for(var i = 0; i < this.players.length; i++){
				player = this.players[i];
				if(!player.isDirty)continue;
				console.log(player.id, player.hp);
				hp.push({id : player.id, hp : player.hp});
				player.isDirty = false;
			}

			if(hp.length)
				io.in(this.id).emit('setHP', hp);
			if(this.emitCoords)
				this.updateCoords(io, this.players, this.map.items);


		},
		updateCoords : function(io, players, items) {
			var delta = (ping.average / 10 * 5);

			var playerCoords = [];
			for(var i = 0; i < players.length; i++){
				var p = players[i];
				if(!p)continue;
				if(p.left)p.x -= delta;
				if(p.right)p.x += delta;
				if(p.jumping)p.y  -= delta;
				p.setX(p.x);
				p.setY(p.y);
				playerCoords.push({x : p.x, y : p.y, id : p.id});

			}

			var itemCoords = [];
			for(var i = 0; i < items.length; i++){
				if(items[i].type === 'kinematic'){
					if(items[i].direction === 'up')
						items[i].y -= delta;
					else items[i].y += delta;
					itemCoords.push({x : items[i].x, y : items[i].y, id : items[i].id});
				}

			}

			io.in(this.id).emit('coords', {players : playerCoords, mapItems : itemCoords});


		},
		emitToPlayer : function (io, player, event, data) {
			if(player && io.sockets.connected[player.socketId])
				io.sockets.connected[player.socketId].emit(event, data);
		}
	}

	return Instance;
});