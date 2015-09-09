define("game/character/player/playerManagerServer", [
	'core/emitter'
	], 
	function (emitter) {


	function PlayerManagerServer () {
		
	}

	PlayerManagerServer.prototype = {
		init : function (pm) {
			this.pm = pm;
			this.events();
		},
		events : function () {
			emitter.on('createUser', this.createUser.bind(this));
		},
		createUser : function (socket) {
			var player = this.pm.createPlayer({instanceId : socket.instance.id, socketId : socket.id});
			player.init(socket.instance.b2d);

			socket.user = player.obj();
			socket.player = player;
			socket.instance.addPlayer(player);
			this.sendUserToClient(socket);
			this.emitPlayerToOthers(socket);

		},
		sendUserToClient : function (socket) {
			socket.emit('createUser', socket.user);
			this.emitPlayersToClient(socket);

		},
		emitPlayerToOthers : function (socket) {
			socket.broadcast.to(socket.instance.id).emit('createPlayer', socket.user);
		},
		emitPlayersToClient : function (socket) {
			for(var i = 0; i < this.pm.players.length; i++){
				if(this.pm.players[i].id !== socket.user.id && this.pm.players[i].instanceId === socket.instance.id){
					socket.emit('createPlayer', this.pm.players[i].obj());
				}
			}
		}

	}

	return new PlayerManagerServer;
})