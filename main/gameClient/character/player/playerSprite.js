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
	}

	PlayerSprite.prototype = {
		init : function () {
			this.events();
			this.player.sprite = this;	
		},
		events : function () {
			emitter.on('tick', this.tick.bind(this));
			emitter.on('doneloading', this.setup.bind(this));
		},
		setup : function () {
			var username = this.player.username;
			var characterClass = classManager.create(this.player.character, this.player);

			this.animation = characterClass.animation;
			this.characterClass = characterClass.characterClass;

			username = username.substr(0,1).toUpperCase() + username.substr(1);


			this.nameBackground = createjs.box("#222", 75, 20);
			this.name = createjs.text(username, "16px arial");
			this.name.textAlign = "center";

			this.hpw = 75;
			this.hph = 10;
			this.hpx = 10;
			this.hpy = 40;

			this.hpbackgound1 = createjs.box('#222', this.hpw, this.hph);
			this.hpbackgound = createjs.box('white', this.hpw - 2, this.hph - 2);
			this.hp = createjs.box("green", this.hpw - 4, this.hph - 4);
		},
		tick : function () {
			if(!this.player || !this.animation)return;
			this.animation.x = this.player.x;
			this.animation.y = this.player.y;
			this.updateName();
			this.updateHp();

			var removeBullets = [];


			for(var i = 0; i < this.characterClass.bullets.length; i++){
				var bullet = this.characterClass.bullets[i];
				if(bullet.bullet && bullet.bullet.body)
					bullet.update();
				else removeBullets.push(bullet);
			}

			for(var i = 0; i = removeBullets.length; i++){
				var bullet = removeBullets[i];
				this.characterClass.destroy(bullet, createjs);
			}

		},
		mouseDown : function () {
			this.characterClass.mouseDown(this.player.characterClass.shootBullet.bullets.slice(-1), createjs);
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
			this.hp.x = this.player.x - (this.hpx - 2);
			this.hp.y = this.player.y - (this.hpy - 2);
			this.hp.scaleX = this.player.hp / this.player.characterClass.stats.hp;
			this.hpbackgound.x = this.player.x - (this.hpx - 1);
			this.hpbackgound.y = this.player.y - (this.hpy - 1);
			this.hpbackgound1.x = this.player.x - this.hpx;
			this.hpbackgound1.y = this.player.y - this.hpy;
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
		create : function () {
			createjs.add(this.animation);
			createjs.add(this.nameBackground);
			createjs.add(this.name);
			createjs.add(this.hpbackgound1);
			createjs.add(this.hpbackgound);
			createjs.add(this.hp);
		},
		destroy : function () {
			createjs.destroy(this.animation);
			createjs.destroy(this.hp);
			createjs.destroy(this.hpbackgound);
			createjs.destroy(this.hpbackgound1);
			createjs.destroy(this.nameBackground);
			createjs.destroy(this.name);
		}
	}

	return PlayerSprite;
});