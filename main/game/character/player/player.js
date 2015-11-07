define("game/character/player/player", [
		'core/keys', 
		'core/props',
		'core/b2d'
	], 
	function (keys, props, b2d) {

	function Player (obj) {
		this.x = 10;
		this.y = 10;
		this.w = 50;
		this.h = 100;
		this.id = 'player';
		this.speed = 100;
		this.fixedRotation = true;
		this.username = '';
		this.team = 'team0';
		this.base = 'base0';
		this.categoryBits;
		this.maskBits;
		this.density = 2;
		this.friction = 0.2;
		this.elementName = 'player';
		this.policies = ['player', 'character'];

		this.deaths = 0;
		this.kills = 0;
		this.damagedBy = [];
		this.killedBy = [];
		this.killed = [];
		this.deathTimer = 3;

		this.previousX = 10;
		this.previousY = 10;
		this.sides = {
			right : this.x + (this.w) + 5,
			left : this.x - 5,
			top : this.y - 5,
			bottom : this.y + (this.h)
		}

		this.isDirty = false;

		// Property overrides
		for(var i in obj)
			this[i] = obj[i];

		

		this.frames = 0;

		this.jumpAvailable = true;
		this.smallJumpAvailable = false;


		// Elements player can see
		this.visibleMapElements = [];
		this.visibleMapPlayers = [];
		this.visibleMapItems = [];

		// Events
		this.events = {};

		this.isBlur = false;

	}

	Player.prototype = {
		init : function (characterClass) {
			this.characterClass = characterClass;
			for(var i in characterClass.stats)
				this[i] = characterClass.stats[i];
			this.characterClass.init(b2d);

			this.create(b2d);
			this.started = true;
		},
		isStarted : function () {
			return this.started;
		},
		create : function (b2d, obj) {
			this.body = b2d.rect(this.obj());
			if(!obj){
				this.body.setX(this.x);
				this.body.setY(this.y);
			}else{
				this.body.setX(obj.x);
				this.body.setY(obj.y);
			}
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

			if(this.gettingDamaged)
				this.damage(this.damageDealt);


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

			

			if(policies.match(/floor|wall/))
				if(colide.top < this.sides.bottom && colide.bottom > this.sides.top && (this.sides.right < colide.left + 10 || this.sides.left > colide.right - 10))
					this.smallJumpAvailable = true;
				
			

			if(policies.match('constantDamage'))
				this.constantDamage(item.damage);
			
			if(policies.match('bullet') && item.team !== this.team && !item.hitPlayer){
				this.damage(item.damageDealt, item.owner);
				item.hitPlayer = true;
			}
			

			if(policies.match('item')){
				if(policies.match('heal'))
					this.heal(item.heal);
			}

		},
		contactPostSolve : function (item) {
			if(!item.policies)return;
			var colide = item.sides,
				policies = item.policies.join('');

			if(policies.match('floor'))
				if(this.sides.bottom < colide.top && (this.sides.left < colide.right - 5 || this.sides.right > colide.left + 5) ){
					this.jumpAvailable = true;
					this.currentlyJumping = false;
				}

		},
		endContact : function (item) {
			if(!item.policies)return;
			var policies = item.policies.join('');

			this.smallJumpAvailable = false;
			this.jumpAvailable = false;

			if(policies.match('spikePit'))
				this.gettingDamaged = false;
		},
		die : function () {
			this.deaths++;
			this.destroy();
			this.isDead = true;
			this.damagedBy = [];
			this.emit('die');
		},
		addKill : function (p) {
			this.kills++;
			this.killed.push(p);	
			this.emit('addKill');
		},
		revive : function () {
			this.hp = this.characterClass.stats.hp;
			this.create(b2d, this.spawnPoint);
			this.isDirty = true;
			this.isDead = false;
			this.deathTimer += (this.deaths * 3);
		},
		heal : function (amount) {
			this.hp += amount;
			if(this.hp > this.characterClass.stats.hp)this.hp = this.characterClass.stats.hp;
			this.emits(['heal', 'changeHP']);
		},
		damage : function (dmg, owner) {
			this.hp -= dmg || 0;
			this.isDirty = true;

			if(owner && this.damagedBy.indexOf(owner) < 0)this.damagedBy.push(owner);
			if(owner && this.hp <= 0){
				this.killer = owner;
				this.killedBy.push(owner);

			}
			this.emits(['hit', 'changeHP']);
		},
		constantDamage : function (dmg) {
			this.gettingDamaged = true;
			this.damageDealt = dmg;
			this.emits(['changeHP']);
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
			this.body.move('right', 10);
			this.emits(['move', 'moveright']);
		},
		moveLeft : function () {
			this.directionFacing = 'left';
			this.body.move('left', 10);
			this.emits(['move', 'moveleft']);
		},
		stopMove : function () {
			// this.body.stopLinearVelocity();
			this.body.move('stop');
		},
		jump : function () {
			this.jumped = true;
			this.jumpAvailable = false;
			this.currentlyJumping = true;
			this.body.applyImpulse('up', 5.5 * this.density);
			this.emits(['move', 'jump']);
		},
		smallJump : function () {
			this.currentlyJumping = true;
			this.body.applyImpulse('up', 3 * this.density);
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
				hp : this.hp,
				str : this.str,
				spd : this.spd,
				agi : this.agi,
				def : this.def,
				characterClass : this.characterClass.stats,
				speed : this.speed,
				fixedRotation : this.fixedRotation,
				username : this.username,
				account : this.account,
				directionFacing : this.directionFacing,
				team : this.team,
				spawnPoint : this.spawnPoint,
				character : this.characterClass.stats.character,
				base : this.base,
				characterSelected : this.characterSelected,
				categoryBits : this.categoryBits,
				maskBits : this.maskBits,
				density : this.density,
				policies : this.policies,
				elementName : this.elementName,
				friction : this.friction
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
			this.characterClass.mouseDown(obj, this.obj());
		},
		mouseUp : function () {
			
		},
		keyDown : function (keyCode) {
			var key = keys[keyCode];

			if(key === 'up' && !this.jumped){
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
			this.emits(['stopmove', 'stop' + key]);
			if(key === 'up'){
				this.jumped = false;
			}else{
				this[key] = false;
				if(key === 'left' || key === 'right')this.stopMove();
			}
		},
		blur : function () {
			for(var i in keys)this.keyUp(i);
		},
		focus : function () {
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
		},
		on : function (event, cb) {
			if(typeof event === 'object'){
				for(var i = 0; i < event.length; i++){
					if(!this.events[event[i]])this.events[event[i]] = [];
					this.events[event[i]].push(cb);
				}

			}else{
				if(!this.events[event])this.events[event] = [];
				this.events[event].push(cb);
			}
		},
		emit : function (event, data) {
			if(this.events[event])
				for(var i = 0; i < this.events[event].length; i++)
					this.events[event][i](data);
		},
		emits : function (events) {
			for(var i = 0; i < events.length; i++){
				this.emit(events[i]);
			}
		}
	}
	return Player;
});