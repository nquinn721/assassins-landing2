define("game/character/player/player", ['core/emitter'], function (emitter) {
	function Player (obj) {
		this.x = 10;
		this.y = 10;
		this.w = 50;
		this.h = 100;
		this.id = 'player';
		this.speed = 5;
		this.fixedRotation = true;
		this.username = '';


		// Client Classes
		this.client = {};

		this.sides = {
			right : this.x + (this.w / 2) + 5,
			left : this.x - (this.w / 2) - 5,
			top : this.y - (this.h / 2) - 5,
			bottom : this.y + (this.h / 2)
		}

		// Property overrides
		for(var i in obj)
			this[i] = obj[i];


		this.frames = 0;

		this.jumpAvailable = false;
		this.smallJumpAvailable = false;
	}

	Player.prototype = {
		init : function (b2d) {
			this.body = b2d.rect(this.obj());
			this.events();
		},
		events : function () {
			emitter.on('contact', this.contact.bind(this));	
			emitter.on('endContact', this.endContact.bind(this));	
		},
		initClient : function (obj) {
			for(var i in obj)
				this.client[i] = obj[i];
		},
		initServer : function () {
			
		},
		tick : function () {
			this.x = this.body.getX();
			this.y = this.body.getY();
			
			this.frames++;

			for(var i in this.client)
				if(this.client[i].tick)this.client[i].tick(this);

			if(this.right)
				this.moveRight();
			if(this.left)
				this.moveLeft();

		},
		contact : function (item) {
			if(!item || !item.two.policies)return;

			var colide = item.two.sides,
				policies = item.two.policies.join('');

			if(policies.match('floor'))
				if(this.sides.bottom < colide.top && (this.sides.left < colide.right - 5 || this.sides.right > colide.left + 5) )
					this.jumpAvailable = true;

			if(policies.match(/floor|wall/))
				if(colide.top < this.sides.bottom && colide.bottom > this.sides.top)
					this.smallJumpAvailable = true;
			
			
		},
		endContact : function (item) {
			if(!item || !item.two.policies)return;

			this.smallJumpAvailable = false;
		},
		setCoords : function (obj) {
			this.body.setX(obj.x);
			this.body.setY(obj.y);
		},
		moveRight : function () {
			this.directionFacing = 'right';
			this.body.move('right');
		},
		moveLeft : function () {
			this.directionFacing = 'left';
			this.body.move('left');
		},
		jump : function () {
			this.body.applyImpulse('up',5);
		},
		smallJump : function () {
			this.body.applyImpulse('up', 3);
		},
		destroy : function  () {
			this.body.destroy();
		},
		obj : function () {
			return {
				x : this.x,
				y : this.y,
				w : this.w,
				h : this.h,
				id : this.id,
				speed : this.speed,
				fixedRotation : this.fixedRotation,
				username : this.username
			}
		},
		keyDown : function (keyCode) {
			var key = this.keys(keyCode);

			if(key === 'jumping'){
				if(this.smallJumpAvailable && !this.jumpAvailable){
					this.smallJumpAvailable = false;
					this.smallJump();
				}
				if(this.jumpAvailable){
					this.jumpAvailable = false;
					this.jump();
				}
				
			}else{
				this[key] = true;
			}
		},
		keyUp : function (keyCode) {
			var key = this.keys(keyCode);

			if(key === 'jumping'){
				// this[key] = false;
			}else{
				this[key] = false;
			}
		},
		keys : function (key) {
			var keys = {
				37 : 'left',
				38 : 'jumping',
				39 : 'right',
				40 : 'duck',
				32 : 'shooting'
			}
			return keys[key];
		}
	}
	return Player;
});