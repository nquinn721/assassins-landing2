define("gameServer/playerManagerServer", [
		'core/b2d',
		'game/character/player/playerManager'
		], function (b2d, playerManager) {
	function PlayerManagerServer () {
		this.players = [];
			
	}
	PlayerManagerServer.prototype = {
		init : function (manager) {
			this.manager = manager;
		},
		tick : function () {
			
		},
		create : function (socket) {
			var Class = require("game/character/classes/" + socket.account.character);
			socket.account.characterClass = new Class;
			var player = playerManager.createPlayer({
					socketId : socket.id, 
					username : socket.account.username,
					cookie : socket.request.cookies.al,
					team : socket.account.team,
					base : socket.account.team === 'team1' ? 'base1' : 'base0',
					categoryBits : socket.account.team === 'team1' ? 0x1000 : 0x2000,
					maskBits : socket.account.team === 'team1' ? 0x0100 | 0x0001 : 0x0200 | 0x0001
				});
			player.init(b2d, socket.account.characterClass);
			
			socket.player = player;
			socket.player.account = {
				username : socket.account.username,
				id : socket.account._id
			}	
			player.on('hit', this.hit);

			this.players.push(player);
		},
		hit : function (socket) {
			socket.emit('hit');
		},
		updatePlayerInfo : function (io) {
			var hp = [],
				player;

			for(var i = 0; i < this.players.length; i++){
				player = this.players[i];
				if(!player.isDirty)continue;
				hp.push({id : player.id, hp : player.hp});

				if(player.hp <= 0)
					this.resurrect(player, io);

				player.isDirty = false;
			}

			if(hp.length)
				io.in(this.id).emit('setHP', hp);
		},
		sendToClient : function (io, socketOnly) {
			var mapItems = this.manager.map.items.map(function (v) {return v.obj(); });

			if(!socketOnly)
				for(var i = 0; i < this.players.length; i++){
					var player = this.players[i];
					this.setSpawnPoint(player);
					io.sockets.connected[player.socketId].emit('start', {map : mapItems, mapName : this.manager.mapName, user : player.obj(), players : this.getAllOthers(player.username)});
				}
			else{
				io.player = this.getByCookie(io.request);
				var players = this.getAllOthers(io.player.username);
				this.setSpawnPoint(io.player);
				io.emit('start', {map : mapItems, mapName : this.manager.mapName, user : io.player.obj(), players : players});
			}
		},
		setSpawnPoint : function (player) {
			for(var i = 0; i < this.manager.map.items.length; i++){
				var item = this.manager.map.items[i];
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
		getByCookie : function (req) {
			var cookie = req.cookies.al;
			for(var i = 0; i < this.players.length; i++)
				if(this.players[i].cookie === cookie)return this.players[i];
		},
		getAllOthers : function (username) {
			var players = [];
			for(var i = 0; i < this.players.length; i++)
				if(this.players[i].username !== username)players.push(this.players[i].obj());
			return players;
		},
		leave : function (player) {
		},
		getById : function (id) {
			for(var i = 0; i < this.players.length; i++)
				if(this.players[i].id === id)return this.players[i];
		}
	}
	return new PlayerManagerServer;
})