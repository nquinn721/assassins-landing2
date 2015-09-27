define("gameClient/character/player/playerManagerClient", 
	[
		'core/emitter', 
		'gameClient/character/player/playerSprite',
		'js/playerStats',
		'game/character/player/playerManager',
		'js/canvas',
		'game/character/classes/assassin',
		'game/character/classes/brute'
	], 
	function (emitter, PlayerSprite, PlayerStats, playerManager, canvas, assassin, brute) {

	function PlayerManagerClient () {
		this.players = [];
		this.user;
		this.frames = 0;

		this.classes = {
			assassin : assassin,
			brute : brute
		}
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
			emitter.on('tick', this.tick.bind(this));
			emitter.on('mousedown', this.mouseDown.bind(this));
		},
		createUser : function (socket) {
			var player = playerManager.createPlayer(socket.player),
				sprite = new PlayerSprite(player),
				playerStats = new PlayerStats(player),
				characterClass = new this.classes[socket.player.characterClass.character];


			playerStats.init();
			sprite.init();
			player.init(socket.b2d, characterClass);
			this.user = player;
			socket.player = player;

		},
		setPlayerCoords : function (obj) {
			for(var i = 0; i < obj.length; i++){
				var player = playerManager.getById(obj[i]);
				if(player)
					player.setCoords(obj[i]);
			}
		},
		mouseDown : function (player) {
			var p = playerManager.getById(player.id);
			p.sprite.mouseDown();
		},
		getUser : function  () {
			return this.user;	
		},
		createPlayer : function (playerObj, addPlayer) {
			if(addPlayer){
				var player = playerManager.createPlayer(playerObj),
					sprite = new PlayerSprite(player),
					characterClass = new this.classes[playerObj.characterClass.character];

				sprite.init();
				player.sprite = sprite;
				player.init(this.b2d, characterClass);
				this.players.push(player);
			}else{
				playerObj.create(this.b2d);
				playerObj.sprite.create();
			}

		},
		createPlayers : function (obj) {
			this.b2d = obj.b2d;
			for(var i = 0; i < obj.players.length; i++){
				var player = obj.players[i];
				this.user.addVisiblePlayer(player);
				this.createPlayer(player, true);
			}
		},
		tick : function () {
			this.frames++;
			for(var i = 0; i < this.players.length; i++)
				if(this.players.id !== this.user.id)
					this.checkLoadStatusOfPlayer(this.players[i]);
		},
		keyup : function (obj) {
			var p = playerManager.getById(obj.player);
			if(p){
				p.keyUp(obj.keyCode);
				p.sprite.keyup(obj.keyCode);
			}
		},
		keydown : function (obj) {
			var p = playerManager.getById(obj.player);
			if(p){
				p.keyDown(obj.keyCode);
				p.sprite.keydown(obj.keyCode);
			}
		},
		destroyPlayer : function (player) {
			player.sprite.destroy();
			player.destroy();
		},
		checkLoadStatusOfPlayer : function (player) {
			var inRange = this.user.checkIfItemIsInRange(player),
				visible = this.user.hasVisiblePlayer(player);

			if(inRange && !visible){
				this.user.addVisiblePlayer(player);
				this.createPlayer(player);
			} else if(!inRange && visible){
				this.user.removeVisiblePlayer(player);
				this.destroyPlayer(player);
			}
		}

	}

	return new PlayerManagerClient;
})