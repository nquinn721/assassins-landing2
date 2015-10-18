define("game/character/abilities/shootBullet/shootBullet", [
		"core/gameMath",
		"game/character/abilities/shootBullet/bullet",
		"core/emitter"
	], function (gameMath, Bullet, emitter) {

	function ShootBullet (b2d) {
		this.bullets = [];

		this.b2d = b2d;
		this.timeBetweenBullets = 200;
		this.waitPeriod = 1000;
		this.availableToShoot = true;
		this.bulletsShotBeforeWait = 5;
		this.bulletsShot = 0;
	}

	ShootBullet.prototype = {
		init : function () {
			emitter.on('contact', this.contact.bind(this));
			emitter.on('tick', this.tick.bind(this));
		},
		shoot : function (obj, char) {
			if(!this.availableToShoot)return;

			var bulletStartX = char.x + (char.w / 2),
				bulletStartY = char.y + (char.h / 2),
				self = this,
				bullet = new Bullet({
					x : bulletStartX,
					y : bulletStartY,// + (char.y + char.h / 2),
					mousex : obj.x,
					mousey : obj.y,
					step : gameMath.getStep([obj.x, obj.y], [bulletStartX , bulletStartY], 10),
					direction : char.directionFacing,
					id : 'bullet' + this.bullets.length,
					owner : char.id,
					base : char.base,
					team : char.team,
					elementName : 'bullet' + char.team
					
				});

			bullet.create(this.b2d);
			this.bullets.push(bullet);
			bullet.shoot();

			this.bulletsShot++;
			this.availableToShoot = false;
			setTimeout(function () {
				self.availableToShoot = true;
			}, this.timeBetweenBullets)
		},
		getById : function (id) {
			for(var i = 0; i < this.bullets.length; i++)
				if(this.bullets[i].id === id)return this.bullets[i];
		},
		destroy : function (bullet) {
			this.bullets.splice(this.bullets.indexOf(bullet), 1);
		},
		tick : function () {
			for(var i = 0; i < this.bullets.length; i++)
				this.bullets[i].tick();
		},
		contact : function (contact) {
			if(contact.one.id.match('bullet') || contact.two.id.match('bullet')){
				var bullet;
				if(contact.one.id.match('bullet'))
					bullet = this.getById(contact.one.id);
				if(contact.two.id.match('bullet'))
					bullet = this.getById(contact.two.id);

				if(bullet){
					this.destroy(bullet);
					bullet.destroy();
				}
			}
		}

	}
	return ShootBullet;
});