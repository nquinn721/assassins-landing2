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
			emitter.on('destroyPlayer', this.destroyPlayer.bind(this));
			emitter.on('createUser', this.createUser.bind(this));

			
		},


		createUser : function (obj) {
			var mapItem,
				socket = obj.socket,
				io = obj.io;


			var player = playerManager.createPlayer({
				socketId : socket.id, 
				username : socket.account.username, 
				characterClass : socket.account.characterClass
			});
			player.init(socket.instance.b2d);

			// Full player class
			socket.player = player;
			socket.player.account = {
				username : socket.account.username,
			}
			socket.instance.join(socket, io);

		},
		destroyPlayer : function (player) {
			playerManager.destroyPlayer(player);
		}
	}

	return new PlayerManagerServer;
})