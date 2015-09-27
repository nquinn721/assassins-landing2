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
		this.groupId = -1;
		this.team = 'team0';
		this.base = 'base0';

		this.previousX = 10;
		this.previousY = 10;
		this.sides = {
			right : this.x + (this.w) + 5,
			left : this.x - 5,
			top : this.y - 5,
			bottom : this.y + (this.h)
		}

		// Property overrides
		for(var i in obj)
			this[i] = obj[i];

		// Extend character class
		var characterObj = obj.characterClass;
		for(var i in characterObj)
			this[i] = characterObj[i];

		this.frames = 0;

		this.jumpAvailable = true;
		this.smallJumpAvailable = false;


		// Elements player can see
		this.visibleMapElements = [];
		this.visibleMapPlayers = [];
		this.visibleMapItems = [];
	}

	Player.prototype = {
		init : function (b2d, characterClass) {
			this.characterClass = characterClass;
			this.characterClass.init(b2d);

			this.create(b2d);
		},
		create : function (b2d) {
			this.body = b2d.rect(this.obj());
			this.body.setX(this.x);
			this.body.setY(this.y);
		},
		tick : function () {
			// Update Previous Position
			this.previousY = this.y;
			this.previousX = this.x;

			
			// Determing if falling
			if(this.previousY > this.y)this.falling = true;
			else this.falling = false;
			
			this.frames++;

			if(this.right)
				this.moveRight();
			if(this.left)
				this.moveLeft();
			if(this.moveup)
				this.moveUp();

			if(this.gettingDamaged){
				this.hp -= this.damageDealt || 1;
			}

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
			if(!item.policies)return;

			var colide = item.sides,
				policies = item.policies.join('');

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

			if(policies.match('spikePit')){
				this.gettingDamaged = true;
				this.damageDealt = 5;
				this.isDirty = true;
			}
			if(policies.match('bullet')){
				this.hp -= 100;
				this.isDirty = true;
			}

		},
		contactPostSolve : function (item) {
			if(!item.policies)return;
			var colide = item.sides,
				policies = item.policies.join('');

			

		},
		endContact : function (item) {
			if(!item.policies)return;
			var policies = item.policies.join('');

			this.smallJumpAvailable = false;

			if(policies.match('spikePit'))
				this.gettingDamaged = false;
		},
		setCoords : function (obj) {
			this.body.setX(obj.x);
			this.body.setY(obj.y);
			this.x = obj.x;
			this.y = obj.y;
		},
		setY : function (y) {
			this.body.setY(y);
			this.y = y;
		},
		setX : function (x) {
			this.body.setX(x);
			this.x = x;
		},
		setHP : function (hp) {
			this.hp = hp;
		},
		moveUp : function () {
			this.body.move('up', 10);
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
				characterClass : this.characterClass.stats,
				speed : this.speed,
				fixedRotation : this.fixedRotation,
				username : this.username,
				account : this.account,
				groupId : this.groupId,
				directionFacing : this.directionFacing,
				team : this.team,
				spawnPont : this.spawnPont
			}
		},
		// Return everything except account
		simpleObj : function () {
			var obj = this.obj(),
				newObj = {};
			for(var i in obj)
				if(i !== 'account')
					newObj[i] = obj[i];
			return 	newObj;
		},
		mouseDown : function (obj) {
			this.characterClass.mouseDown(obj, {x : this.x, y : this.y, w : this.w, h : this.h, direction : this.directionFacing});
		},
		mouseUp : function () {
			
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
		addVisiblePlayer : function (player) {
			this.visibleMapPlayers.push(player);
		},
		removeVisiblePlayer : function (player) {
			this.visibleMapPlayers.splice(this.visibleMapPlayers.indexOf(player), 1);	
		},
		hasVisiblePlayer : function (player) {
			for(var i = 0; i < this.visibleMapPlayers.length; i++)
				if(this.visibleMapPlayers[i].id === player.id)return true;	
		},
		addVisibleItem : function (item) {
			this.visibleMapElements.push(item);
		},
		removeVisibleItem : function (item) {
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
		},
		setTeam : function (team) {
			this.team = team;
		},
		setBase : function (base) {
			this.base = base;
		}
	}
	return Player;
});