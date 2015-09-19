
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
			emitter.on('createPlayers', this.createPlayers.bind(this));
			emitter.on('keydown', this.keydown.bind(this));
			emitter.on('keyup', this.keyup.bind(this));
			emitter.on('destroyPlayer', this.destroyPlayer.bind(this));
			emitter.on('playerCoords', this.setPlayerCoords.bind(this));
		},
		createUser : function (socket) {
			var player = playerManager.createPlayer(socket.player),
				sprite = new PlayerSprite(player);
				
			sprite.init();
			player.init(socket.b2d);
			player.initClient({
				sprite : sprite
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
		getUser : function  () {
			return this.user;	
		},
		createPlayer : function (obj) {
			var player = playerManager.createPlayer(obj.player),
				sprite = new PlayerSprite(player);
			sprite.init();
			player.init(obj.b2d);
			player.initClient({
				sprite : sprite
			});
		},
		createPlayers : function (obj) {
			for(var i = 0; i < obj.players.length; i++)
				this.createPlayer({b2d : obj.b2d, player : obj.players[i]});
		},
		tick : function () {
			canvas.ctx.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height);
		},
		keyup : function (obj) {
			var p = playerManager.getPlayer(obj.player);
			if(p){
				p.keyUp(obj.keyCode);
				p.sprite.keyup(obj.keyCode);
			}
		},
		keydown : function (obj) {
			var p = playerManager.getPlayer(obj.player);
			if(p){
				p.keyDown(obj.keyCode);
				p.sprite.keydown(obj.keyCode);
			}
		},
		destroyPlayer : function (player) {
			var p = playerManager.getPlayer(player);
			p.sprite.destroy();
			playerManager.destroyPlayer(player);
		}

	}

	return new PlayerManagerClient;
})