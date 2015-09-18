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


		this.nameBackground = createjs.box("rgb(112,112,112)", 75, 20);
		this.name = createjs.text(player.account.username)
	}

	PlayerSprite.prototype = {
		init : function () {
			this.events();
			this.player.sprite = this;	
		},
		events : function () {
			emitter.on('tick', this.tick.bind(this));
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
		tick : function () {
			if(!this.player || !this.animation)return;
			this.animation.x = this.player.x;
			this.animation.y = this.player.y;
			this.nameBackground.x = this.player.x - 10;
			this.nameBackground.y = this.player.y - 30;
			this.name.x = this.player.x;
			this.name.y = this.player.y - 32;

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