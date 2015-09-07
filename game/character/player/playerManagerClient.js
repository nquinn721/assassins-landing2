if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define("game/character/player/playerManagerClient", 
	[
		'core/emitter', 
		'game/character/player/playerSprite',
		'js/canvas'
	], 
	function (emitter, PlayerSprite, canvas) {

	function PlayerManagerClient () {

	}

	PlayerManagerClient.prototype = {
		init : function (pm) {
			this.pm = pm;
			this.events();
		},
		events : function () {
			emitter.on('createUser', this.createUser.bind(this));
			emitter.on('createPlayer', this.createPlayer.bind(this));
		},
		createUser : function (obj) {
			var player = this.pm.createPlayer(obj.player);
			player.init(obj.b2d);
			player.initClient({
				sprite : new PlayerSprite
			});
			this.user = player;
		},
		createPlayer : function (obj) {
			var player = this.pm.createPlayer(obj.player);
			player.init(obj.b2d);
			player.initClient({
				sprite : new PlayerSprite
			});
		},
		tick : function () {
			canvas.ctx.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height);
			
		}

	}

	return new PlayerManagerClient;
})