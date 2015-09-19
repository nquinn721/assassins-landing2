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
		createUser : function (socket) {
			var mapItem;
			for(var i = 0; i < socket.instance.map.items.length; i++)
				if(socket.instance.map.items[i].id.match('floor0')){
					mapItem = socket.instance.map.items[i];
					break;
				}
			var player = playerManager.createPlayer({
				socketId : socket.id, 
				username : socket.account.username, 
				y : mapItem.y - 100, 
				x : mapItem.x + mapItem.w / 2,
				characterClass : socket.account.characterClass
			});
			player.init(socket.instance.b2d);

			// Player object for client
			socket.user = player.obj();
			socket.user.account = socket.account;

			// Full player class
			socket.player = player;
			socket.player.account = {
				username : socket.account.username,
				characterClass : socket.account.characterClass
			}
			socket.instance.join(player, socket);


			// this.sendUserToClient(socket);

		},
		sendUserToClient : function (socket) {
			

		},
		destroyPlayer : function (player) {
			playerManager.destroyPlayer(player);
		}
	}

	return new PlayerManagerServer;
})