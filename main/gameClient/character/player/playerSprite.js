define("gameClient/character/player/playerSprite", [
		"js/canvas", 
		"core/props",
		"js/createjs",
		"core/emitter",
		"core/keys",
		"gameClient/character/classes/classManager"
	], function (canvas, props, createjs, emitter, keys, classManager) {

		
	function PlayerSprite(player) {
		this.player = player;
		this.lookingLeft = true;


		var characterClass = classManager.create(player.account.characterClass.sprite);

		this.animation = characterClass.animation;


	}

	PlayerSprite.prototype = {
		init : function () {
			this.events();
			this.player.sprite = this;	
			this.setupPlayerInfo();
		},
		events : function () {
			emitter.on('tick', this.tick.bind(this));
		},
		setupPlayerInfo : function () {
			var username = this.player.account.username;

			username = username.substr(0,1).toUpperCase() + username.substr(1);


			this.nameBackground = createjs.box("#222", 75, 20);
			this.name = createjs.text(username, "16px arial");
			this.name.textAlign = "center";
			this.hpbackgound = createjs.box('black', 75, 7);
			this.hp = createjs.box("green", 73, 5);
		},
		tick : function () {
			if(!this.player || !this.animation)return;
			this.animation.x = this.player.x;
			this.animation.y = this.player.y;
			this.updateName();
			this.updateHp();
			
		},
		keyup : function (keyCode) {
			if(keys[keyCode] === 'up')
				this.stopAnimation('isJumping', 
					this.movingRight ? 'runRight' : 
					this.movingLeft ? 'runLeft' : 
					this.lookingRight ? 'standRight' : 'standLeft'
				);
			if(keys[keyCode] === 'left')this.stopAnimation('movingLeft', 'standLeft', 'movingRight');
			if(keys[keyCode] === 'right')this.stopAnimation('movingRight', 'standRight', 'movingLeft');
			if(this.movingRight){
				this.movingRight = false;
				this.startAnimation('movingRight', 'runRight');
			}
			if(this.movingLeft){
				this.movingLeft = false;
				this.startAnimation('movingLeft', 'runLeft');
			}
		},
		keydown : function (keyCode) {
			if(keys[keyCode] === 'up')this.startAnimation('isJumping', 'jump');
			if(keys[keyCode] === 'left')this.startAnimation('movingLeft', 'runLeft');
			if(keys[keyCode] === 'right')this.startAnimation('movingRight', 'runRight');
			
		},
		stopAnimation : function (action, method, methodCondition) {
			this[action] = false;
			method && !this[methodCondition] && this[method]();
		},
		startAnimation : function (action, method, methodCondition) {
			if(!this[action]){
				this[action] = true;
				this[method]();
			}
		},

		updateName : function () {
			this.nameBackground.x = this.player.x - 10;
			this.nameBackground.y = this.player.y - 30;
			this.name.x = this.player.x + this.player.w / 2;
			this.name.y = this.player.y - 28;
		},
		updateHp : function () {
			this.hp.x = this.player.x - 9;
			this.hp.y = this.player.y - 39;
			this.hp.scaleX = this.player.hp / this.player.characterClass.hp;
			this.hpbackgound.x = this.player.x - 10;
			this.hpbackgound.y = this.player.y - 40;
		},
		lookLeft : function () {
			this.lookingRight = false;
			this.lookingLeft = true;
		},
		lookRight : function () {
			this.lookingRight = true;
			this.lookingLeft = false;
		},
		jump : function () {
			if(this.lookingLeft)
				this.animation.gotoAndPlay('jumpLeft');
			else this.animation.gotoAndPlay('jumpRight');
		},
		standLeft : function () {
			this.animation.gotoAndPlay('standLeft');
		},
		standRight : function () {
			this.animation.gotoAndPlay('standRight');	
		},
		runLeft : function () {
			this.lookLeft();
			this.animation.gotoAndPlay('runLeft');
		},
		runRight : function () {
			this.lookRight();
			this.animation.gotoAndPlay('runRight');
		},
		destroy : function () {
			createjs.stage.removeChild(this.animation);
		}
	}

	return PlayerSprite;
});