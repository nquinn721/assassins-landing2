define("game/character/abilities/shootBullet/bullet", function () {
	function Bullet (obj) {
		this.x = 50;
		this.y = 50;
		this.w = 10;
		this.h = 10;
		this.type = 'dynamic';
		this.speed = 10;
		this.groupId = -1;
		this.policies = ['bullet'];

		this.mousex = 10;
		this.mousey = 10;
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
			// this.body.destroy();
		},
		shoot : function () {
			this.body.applyForce([this.step.x, this.step.y], 15);
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
				policies : this.policies
			}
		}
	}

	return Bullet;
})