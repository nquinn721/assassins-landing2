define("game/character/abilities/shootBullet/bullet", function () {
	function Bullet (obj) {
		this.x = 50;
		this.y = 50;
		this.w = 10;
		this.h = 10;
		this.type = 'dynamic';
		this.speed = 7;
		this.groupId = -1;
		this.policies = ['bullet'];
		this.damageDealt = 400;
		this.elementName = 'bullet';

		this.mousex = 10;
		this.mousey = 10;
		this.destroyed = false;
		
		for(var i in obj)this[i] = obj[i];

	}

	Bullet.prototype = {
		create : function (b2d) {
			this.body = b2d.rect(this.obj());
		},
		setX : function (x) {
			this.body.setX(x);
			this.x = x;
		},
		setY : function (y) {
			this.body.setY(y);
			this.y = y;
		},
		destroy : function () {
			this.destroyed = true;
			this.body.destroy();
		},
		shoot : function () {
			var yBound = 6,
				y = this.step.y > yBound ? yBound : this.step.y < -yBound ? -yBound : this.step.y;
			this.body.applyForce([this.step.x < 0 ? -this.speed : this.speed, y]);
		},
		tick : function () {
			this.body.applyForce('up', 0.25);	
		},
		obj : function () {
			return {
				x : this.x, 
				y : this.y,
				w : this.w, 
				h : this.h,
				speed : this.speed,
				type : this.type,
				id : this.id,
				isBullet : true,
				policies : this.policies,
				owner : this.owner,
				base : this.base,
				team : this.team,
				// isSensor : true,
				categoryBits : this.categoryBits,
				maskBits : this.maskBits,
				damageDealt : this.damageDealt,
				elementName : this.elementName
			}
		}
	}

	return Bullet;
})