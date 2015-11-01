define("gameClient/character/player/playerSprite", [
		"core/props",
		"gameClient/stage/stage",
		"core/emitter",
		"core/keys",
		"gameClient/character/classes/classManager"
	], function (props, stage, emitter, keys, classManager) {

		
	function PlayerSprite(player, onUsersTeam) {
		this.player = player;
		this.lookingLeft = true;
		this.isHit = false;

		this.onUsersTeam = onUsersTeam;
	}

	PlayerSprite.prototype = {
		init : function () {
			this.events();
			this.player.sprite = this;	
		},
		events : function () {
			emitter.on('tick', this.tick.bind(this));
			emitter.on('doneloading', this.setup.bind(this));
			emitter.on('hit', this.hit.bind(this));
			emitter.on('win', this.win.bind(this));
			emitter.on('win', this.win.bind(this));
			emitter.on('die', this.die.bind(this));
			emitter.on('revive', this.revive.bind(this));
		},
		hit : function () {
	        var self = this;
			if(this.isHit)return;
	        this.isHit = true;

	        // this.hitMarker = stage.hitMarker(props.canvas.currentX, props.canvas.currentY, props.view.w, props.view.h);

	        setTimeout(function () {
	        	self.isHit = false;
	        	stage.destroy(self.hitMarker);
	        }, 200);
		},
		win : function () {
			stage.box("#088A2B", props.canvas.currentX + props.view.w / 2 - 75, props.canvas.currentY + props.view.h / 2 - 20, 175, 40);
			stage.text("Yay! You Win!", null, null, props.canvas.currentX + props.view.w / 2 - 50, props.canvas.currentY + props.view.h / 2 - 10);
		},
		lose : function () {
			stage.box("#651515", props.canvas.currentX + props.view.w / 2 - 175, props.canvas.currentY + props.view.h / 2 - 20, 320, 40);
			stage.text("Sorry! Better Luck Next Time!", null, null, props.canvas.currentX + props.view.w / 2 - 150, props.canvas.currentY + props.view.h / 2 - 10);
		},	
		moveHitMarker : function () {
			if(this.isHit){
				stage.destroy(this.hitMarker);
		        this.hitMarker = stage.hitMarker(props.canvas.currentX, props.canvas.currentY, props.view.w, props.view.h);
				// this.hitMarker.image.x = props.canvas.currentX;
				// this.hitMarker.image.y = props.canvas.currentY;
			}	
		},
		setup : function () {
			var username = this.player.username;
			var characterClass = classManager.create(this.player.character, this.player);

			this.animation = characterClass.animation;
			this.characterClass = characterClass.characterClass;

			username = username.substr(0,1).toUpperCase() + username.substr(1);


			this.nameBackground = stage.box("#222", 0,0,75, 20);
			this.name = stage.text(username, "16px arial");
			this.name.textAlign = "center";

			this.hpw = 75;
			this.hph = 10;
			this.hpx = 10;
			this.hpy = 40;

			this.hpbackgound1 = stage.box('#222', 0,0, this.hpw, this.hph);
			this.hpbackgound = stage.box('white', 0,0, this.hpw - 2, this.hph - 2);
			this.hp = stage.box((this.onUsersTeam ? "green" : "#B50D0D"), 0,0,this.hpw - 4, this.hph - 4);
		},
		tick : function () {
			if(!this.player || !this.animation)return;
			this.animation.x = this.player.x;
			this.animation.y = this.player.y;
			this.updateName();
			this.updateHp();

			if(this.player.jumpAvailable && this.isJumping)
				this.stopJumping();
			this.moveHitMarker();

		},
		mouseDown : function () {
			var bullet = this.player.characterClass.shootBullet.bullets.slice(-1)[0];
			this.characterClass.mouseDown(bullet);
		},
		keyup : function (keyCode) {
			if(keys[keyCode] === 'up')this.stopJumping();
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
		resetKeys : function () {
			for(var i in keys)
				this.keyup(i);	
		},
		stopJumping : function () {
			this.stopAnimation('isJumping', 
					this.movingRight ? 'runRight' : 
					this.movingLeft ? 'runLeft' : 
					this.lookingRight ? 'standRight' : 'standLeft'
				);
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
			if(this.player.hp < 0)return;
			
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
		die : function (player) {
			if(player.id === this.player.id)
				this.destroy();
		},
		revive : function (player) {
			console.log('revive spritee', player, this.player);
			if(player.id === this.player.id)
				this.create();
		},
		create : function () {
			stage.add(this.animation);
			stage.add(this.nameBackground);
			stage.add(this.name);
			stage.add(this.hpbackgound1);
			stage.add(this.hpbackgound);
			stage.add(this.hp);
		},
		
		destroy : function () {
			stage.destroy(this.animation);
			stage.destroy(this.hp);
			stage.destroy(this.hpbackgound);
			stage.destroy(this.hpbackgound1);
			stage.destroy(this.nameBackground);
			stage.destroy(this.name);
		}
	}

	return PlayerSprite;
});