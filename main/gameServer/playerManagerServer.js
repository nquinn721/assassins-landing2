define("gameServer/playerManagerServer", [
		'core/b2d',
		'game/character/player/playerManager'
		], function (b2d, playerManager) {
	function PlayerManagerServer () {
		this.players = [];
			
	}
	PlayerManagerServer.prototype = {
		tick : function () {
			
		},
		create : function (socket) {
			var Class = require("game/character/classes/" + socket.account.character);
			socket.account.characterClass = new Class;
			var player = playerManager.createPlayer({
					socketId : socket.id, 
					username : socket.account.username,
					team : socket.account.team,
					base : socket.account.team === 'team1' ? 'base0' : 'base1',
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
		leave : function (player) {
			this.players.splice(this.players.indexOf(player), 1);
		},
		getById : function (id) {
			for(var i = 0; i < this.players.length; i++)
				if(this.players[i].id === id)return this.players[i];
		}
	}
	return new PlayerManagerServer;
})