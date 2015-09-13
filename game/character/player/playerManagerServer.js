define("game/character/player/playerManagerServer", [
	'core/emitter',
	'game/character/player/playerManager'
	], 
	function (emitter, playerManager) {


	function PlayerManagerServer () {
		this.serverFrames = 0;
	}

	PlayerManagerServer.prototype = {
		init : function () {
			this.events();
		},
		events : function () {
			emitter.on('createUser', this.createUser.bind(this));
		},
		createUser : function (socket) {
			var player = playerManager.createPlayer({socketId : socket.id, username : socket.account.username});
			player.init(socket.instance.b2d);

			// Player object for client
			socket.user = player.obj();
			socket.user.username = socket.account.username;
			// Full player class
			socket.player = player;
			
			socket.instance.join(player);


			this.sendUserToClient(socket);
			this.emitPlayerToOthers(socket);

		},
		sendUserToClient : function (socket) {
			socket.emit('createUser', {user : socket.user});
			socket.emit('start');
			this.emitPlayersToClient(socket);

		},
		emitPlayerToOthers : function (socket) {
			socket.broadcast.to(socket.instance.id).emit('createPlayer', socket.user);
		},
		emitPlayersToClient : function (socket) {
			for(var i = 0; i < playerManager.players.length; i++){
				if(playerManager.players[i].id !== socket.user.id && playerManager.players[i].instanceId === socket.instance.id){
					socket.emit('createPlayer', playerManager.players[i].obj());
				}
			}
		}

	}

	return new PlayerManagerServer;
})