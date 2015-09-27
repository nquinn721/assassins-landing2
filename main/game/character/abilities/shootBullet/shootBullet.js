define("game/character/abilities/shootBullet/shootBullet", [
		"core/gameMath",
		"game/character/abilities/shootBullet/bullet",
		"core/emitter"
	], function (gameMath, Bullet, emitter) {

	function ShootBullet (b2d) {
		this.bullets = [];

		this.b2d = b2d;
	}

	ShootBullet.prototype = {
		init : function () {
			emitter.on('contact', this.contact.bind(this));
		},
		shoot : function (obj, char) {
			var bulletStartX = char.x - (char.direction === 'left' ? 15 : -(char.w + 15)),
				bulletStartY = char.y + (char.h / 2);

			if(char.direction === 'left' && obj.x < char.x || char.direction === 'right' && obj.x > char.x + char.w){
				var bullet = new Bullet({
					x : bulletStartX,
					y : bulletStartY,// + (char.y + char.h / 2),
					mousex : obj.x,
					mousey : obj.y,
					step : gameMath.getStep([obj.x, obj.y], [bulletStartX , bulletStartY], 10),
					direction : char.direction,
					id : 'bullet' + this.bullets.length
				});
				bullet.create(this.b2d);
				this.bullets.push(bullet);
				bullet.shoot();
			}
		},
		getById : function (id) {
			for(var i = 0; i < this.bullets.length; i++)
				if(this.bullets[i].id === id)return this.bullets[i];
		},
		destroy : function (bullet) {
			this.bullets.splice(this.bullets.indexOf(bullet), 1);
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