define("game/character/player/playerManager", [
	'game/character/player/player', 
	'core/lib/underscore', 
	'core/emitter', 
	'core/props'
	], 
	function (Player, _, emitter, props) {


	function PlayerManager () {
		this.players = [];
		this.totalPlayers = 0;
	}

	PlayerManager.prototype = {
		init : function () {
			this.events();	
		},
		initClient : function () {
			var self = this;
			require(['gameClient/character/player/playerManagerClient'], function  (pm) {
				self.pm = pm;
				self.pm.init(self);
			});
		},
		initServer : function  () {
			this.pm = require('game/character/player/playerManagerServer');
			this.pm.init(this);
		},
		events : function () {
			emitter.on('destroyPlayer', this.destroyPlayer.bind(this));
		},
		createPlayer : function (obj) {
			var playerObj = {
				x : Math.random() * props.canvas.w,
				y : 100,
				id : 'player' + this.totalPlayers,
				speed : 5,
				w : 50,
				h : 100
			}, player;

			if(obj)
				for(var i in obj)
					playerObj[i] = obj[i];
			

			player = new Player(playerObj);

			this.players.push(player);
			this.totalPlayers++;
			
			return player;
		},
		
		
		destroyPlayer : function (obj) {
			if(obj instanceof Player)
				player = obj;
			else player = this.getPlayer(obj);

			if(player){
				for(var i = 0; i < this.players.length; i++){
					if(this.players[i].id === player.id){
						this.players.splice(i, 1);
					}
				}
				player.destroy();
			}
		},
		getPlayer : function (obj) {
			for(var i = 0; i < this.players.length; i++)
				if(this.players[i].id === obj.id)
					return this.players[i];
		},
		tick : function () {
			if(this.pm.tick)this.pm.tick();
			for(var i = 0; i < this.players.length; i++)
				this.players[i].tick();
		}
	}

	return new PlayerManager;
});