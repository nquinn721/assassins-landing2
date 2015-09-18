define("game/character/player/playerManager", [
	'game/character/player/player', 
	'core/lib/underscore', 
	'core/emitter', 
	'core/props',
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
		events : function () {
			emitter.on('tick', this.tick.bind(this));
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
			
			if(playerObj.x < 20)playerObj.x = 20;
			if(playerObj.x > props.canvas.w - 70)playerObj.x = props.canvas.w - 70;

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
			for(var i = 0; i < this.players.length; i++)
				this.players[i].tick();
		}
	}

	var pm = new PlayerManager;
	pm.init();
	return pm;
});