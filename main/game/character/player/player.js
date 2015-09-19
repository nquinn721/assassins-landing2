define("game/character/player/player", [
		'core/emitter', 
		'core/keys', 
		'core/props'
	], 
	function (emitter, keys, props) {

	function Player (obj) {
		this.x = 10;
		this.y = 10;
		this.w = 50;
		this.h = 100;
		this.id = 'player';
		this.speed = 5;
		this.fixedRotation = true;
		this.username = '';


		this.previousX = 10;
		this.previousY = 10;
		this.sides = {
			right : this.x + (this.w) + 5,
			left : this.x - 5,
			top : this.y - 5,
			bottom : this.y + (this.h)
		}

		// Client Classes
		this.client = {};


		// Property overrides
		for(var i in obj)
			this[i] = obj[i];


		this.frames = 0;

		this.jumpAvailable = false;
		this.smallJumpAvailable = false;


		// Elements player can see
		this.visibleMapElements = [];
		this.visibleMapPlayers = [];
		this.visibleMapItems = [];
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
			// Update Previous Position
			this.previousY = this.y;
			this.previousX = this.x;

			
			// Determing if falling
			if(this.previousY > this.y)this.falling = true;
			else this.falling = false;
			
			this.frames++;

			for(var i in this.client)
				if(this.client[i].tick)this.client[i].tick(this);

			if(this.right)
				this.moveRight();
			if(this.left)
				this.moveLeft();


			// Update Current Position
			this.x = this.body.getX();
			this.y = this.body.getY();

			// Update sides
			this.sides = {
				right : this.x + (this.w) + 5,
				left : this.x - 5,
				top : this.y - 5,
				bottom : this.y + (this.h)
			}
		},
		moving : function (dir) {
			return this[dir];
		},
		is : function (action) {
			return this['is' + action.substr(0,1).toUpperCase() + action.substr(1)];
		},
		isFalling : function () {
			return this.falling;
		},
		isJumping : function  () {
			return 	this.jumping;
		},
		contact : function (item) {
			if(!item || !item.two.policies)return;

			var colide = item.two.sides,
				policies = item.two.policies.join('');

			if(policies.match('floor'))
				if(this.sides.bottom < colide.top && (this.sides.left < colide.right - 5 || this.sides.right > colide.left + 5) ){
					this.jumpAvailable = true;
					this.currentlyJumping = false;
				}

			if(policies.match(/floor|wall/)){
				if(colide.top < this.sides.bottom && colide.bottom > this.sides.top && (this.sides.right < colide.left + 6 || this.sides.left > colide.right - 6)){
					this.smallJumpAvailable = true;
				}
			}
			
			
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
			this.currentlyJumping = true;
			this.body.applyImpulse('up',5);
		},
		smallJump : function () {
			this.currentlyJumping = true;
			this.body.applyImpulse('up', 3.5);
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
				username : this.username,
				account : this.account
			}
		},
		keyDown : function (keyCode) {
			var key = keys[keyCode];

			if(key === 'up' && !this.jumped){
				this.jumped = true;

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
			var key = keys[keyCode];

			if(key === 'up'){
				this.jumped = false;
			}else{
				this[key] = false;
			}
		},
		getVisibleItems : function () {
			return this.visibleMapItems;
		},
		getVisiblePlayers : function () {
			return this.visibleMapPlayers;
		},
		addVisibleItem : function (item) {
			if(item.id.match('player'))this.visibleMapPlayers.push(item);
			else this.visibleMapItems.push(item);

			this.visibleMapElements.push(item);
		},
		removeVisibleItem : function (item) {
			if(item.id.match('player'))this.visibleMapPlayers.splice(this.visibleMapPlayers.indexOf(item), 1);
			else this.visibleMapItems.splice(this.visibleMapItems.indexOf(item), 1);

			this.visibleMapElements.splice(this.visibleMapElements.indexOf(item), 1);
		},
		hasVisibleItem : function (item) {
			for(var i = 0; i < this.visibleMapElements.length; i++)
				if(this.visibleMapElements[i].id === item.id)return true;
		},
		checkIfItemIsInRange : function (item) {
			if(
				item.x + item.w >= this.x - props.mapShowingDistance && 
				item.x <= this.x + props.mapShowingDistance && 
				item.y + item.h >= this.y - props.mapShowingDistance && 
				item.y <= this.y + props.mapShowingDistance
			)return true;
			return false;
		}
	}
	return Player;
});