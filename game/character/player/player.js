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


		// Property overrides
		for(var i in obj)
			this[i] = obj[i];


		this.frames = 0;

		this.jumpAvailable = true;
	}

	Player.prototype = {
		init : function (b2d) {
			this.body = b2d.rect(this.obj());
			this.events();
		},
		events : function () {
			emitter.on('contact', this.contact.bind(this));	
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

			if(this.left || this.right)
				emitter.emit('playerCoords', {x : this.x, y : this.y});

		},
		contact : function (item) {
			if(!item || !item.two.id)return;

			if(item.two.id.match(/floor|elevator/) || item.two.id.match('player') && this.y + (this.h / 2) - 5 < item.two.y)
				this.jumpAvailable = true;
			
			
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