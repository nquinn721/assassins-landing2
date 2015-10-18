define("gameClient/character/player/playerManagerClient", 
	[
		'core/b2d',
		'core/emitter', 
		'gameClient/character/player/playerSprite',
		'game/character/player/playerManager',
		'game/character/classes/assassin',
		'game/character/classes/brute',
		'gameClient/playerStats',
		'gameClient/client'
	], 
	function (b2d, emitter, PlayerSprite, playerManager, assassin, brute, PlayerStats, client) {

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
			emitter.on('blur', this.blur.bind(this));
			emitter.on('focus', this.focus.bind(this));
			emitter.on('destroyPlayer', this.destroyPlayer.bind(this));
			emitter.on('playerCoords', this.setPlayerCoords.bind(this));
			emitter.on('mousedown', this.mouseDown.bind(this));
			emitter.on('init', this.loadPlayer.bind(this));
			emitter.on('die', this.die.bind(this));
		},
		createUser : function (user) {
			var player = playerManager.createPlayer(user),
				sprite = new PlayerSprite(player, true),
				playerStats = new PlayerStats(player),
				characterClass = new this.classes[player.characterClass.character];


			playerStats.init();
			sprite.init();
			player.init(characterClass);
			this.user = player;
			client.createUser(player);
		},
		setPlayerCoords : function (obj) {
			for(var i = 0; i < obj.length; i++){
				var player = playerManager.getById(obj[i]);
				if(player)
					player.setCoords(obj[i]);
			}
		},
		mouseDown : function (obj) {
			var p = playerManager.getById(obj.player.id);
			p.sprite.mouseDown();
		},
		getUser : function  () {
			return this.user;	
		},
		createPlayer : function (playerObj, addPlayer) {
			if(addPlayer){
				var player = playerManager.createPlayer(playerObj),
					sprite = new PlayerSprite(player, player.team === this.user.team ? true : false),
					characterClass = new this.classes[playerObj.characterClass.character];

				sprite.init();
				player.sprite = sprite;
				player.init(characterClass);
				this.players.push(player);
			}else{
				playerObj.create(b2d);
				playerObj.sprite.create();
			}

		},
		die : function (player) {
			if(player.id === this.user.id)
				emitter.emit('timer', this.user.deathTimer);
		},
		createPlayers : function (players) {
			for(var i = 0; i < players.length; i++){
				var player = players[i];
				this.user.addVisiblePlayer(player);
				this.createPlayer(player, true);
			}
		},
		loadPlayer : function () {
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
		blur : function () {
			var p = playerManager.getById(this.user);
			if(p){
				p.blur();
				p.sprite.resetKeys();
			}
		},
		focus : function () {
			var p = playerManager.getById(this.user);
			if(p){
				p.focus();
				// p.sprite.focus();
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