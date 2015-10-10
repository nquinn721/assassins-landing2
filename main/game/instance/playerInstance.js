define("game/instance/playerInstance", [
	"core/emitter",
	"game/character/player/playerManager",
	"core/props",
	"core/lib/underscore"
	], function (emitter, playerManager, props, _) {
	function PlayerInstance (instance, id, b2d) {
		this.instance = instance;
		this.players = [];
		this.id = id;
		this.b2d = b2d;

		// Emit Coords
		this.emitCoords = true;

	}
	PlayerInstance.prototype = {
		add : function (player) {
			this.players.push(player);	
		},
		tick : function (io) {
			this.updatePlayerInfo(io);

			if(this.emitCoords)
				this.updateCoords(io);
			
		},
		start : function (socket) {
			socket.player.init(this.b2d);
		},
		createUser : function (socket, io, base, team) {
			var player = playerManager.createPlayer({
					socketId : socket.id, 
					username : socket.account.username,
					// characterClass : socket.account.characterClass.stats,
					team : team,
					base : base,
					categoryBits : team === 'team1' ? 0x1000 : 0x2000,
					maskBits : team === 'team1' ? 0x0100 | 0x0001 : 0x0200 | 0x0001
				});
			// player.init(this.b2d, socket.account.characterClass);
			
			socket.player = player;
			socket.player.account = {
				username : socket.account.username,
				id : socket.account._id
			}
			this.add(player);
			socket.join(this.id);
			player.on('hit', this.hit.bind(this, socket));
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
		characterSelect : function (socket, character) {
			this.getById(socket.player.id).characterSelected = character;
			socket.broadcast.emit('character-select', {player : socket.player.obj(), chracter : character})
		},
		updateCharacterSelect : function (socket) {
			var objs = [];
			for(var i = 0; i < this.players.length; i++)
				if(this.players[i].characterSelected && this.players[i].team === socket.player.team)
					objs.push({
						username : this.players[i].username,
						characterSelected : this.players[i].characterSelected
					});
			socket.emit('characters-selected', objs);
		},
		resurrect : function (player, io) {
			emitter.emit('die', {player : player, b2d : this.b2d});
			io.in(this.id).emit('die', player.obj());
		},
		getById : function (id) {
			for(var i = 0; i < this.players.length; i++)
				if(this.players[i].id === id)return this.players[i];
		},
		updateCoords : function(io) {
			var players = this.players;

			var playerCoords = [];
			for(var i = 0; i < players.length; i++){
				var p = players[i];
				if(!p)continue;
				playerCoords.push({x : p.x, y : p.y, id : p.id});

			}

			

			io.in(this.id).emit('playerCoords', playerCoords);


		}
	}
	return PlayerInstance;
});