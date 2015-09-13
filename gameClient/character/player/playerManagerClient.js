
define("gameClient/character/player/playerManagerClient", 
	[
		'core/emitter', 
		'gameClient/character/player/playerSprite',
		'game/character/player/playerManager',
		'js/canvas'
	], 
	function (emitter, PlayerSprite, playerManager, canvas) {

	function PlayerManagerClient () {

	}

	PlayerManagerClient.prototype = {
		init : function () {
			this.events();
		},
		events : function () {
			emitter.on('createUser', this.createUser.bind(this));
			emitter.on('createPlayer', this.createPlayer.bind(this));
			emitter.on('keydown', this.keydown.bind(this));
			emitter.on('keyup', this.keyup.bind(this));
			emitter.on('playerCoords', this.setPlayerCoords.bind(this));
		},
		createUser : function (socket) {
			var player = playerManager.createPlayer(socket.player);
			player.init(socket.b2d);
			player.initClient({
				sprite : new PlayerSprite(player, socket.account)
			});
			this.user = player;
			socket.player = player;

		},
		setPlayerCoords : function (obj) {
			for(var i = 0; i < obj.length; i++){
				var player = playerManager.getPlayer(obj[i]);
				if(player)
					player.setCoords(obj[i]);
			}
		},
		createPlayer : function (obj) {
			var player = playerManager.createPlayer(obj.player);
			player.init(obj.b2d);
			player.initClient({
				sprite : new PlayerSprite(player)
			});
		},
		tick : function () {
			canvas.ctx.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height);
		},
		keyup : function (obj) {
			var p = playerManager.getPlayer(obj.player);
			p.keyUp(obj.keyCode);
		},
		keydown : function (obj) {
			var p = playerManager.getPlayer(obj.player);
			p.keyDown(obj.keyCode);
		}

	}

	return new PlayerManagerClient;
})