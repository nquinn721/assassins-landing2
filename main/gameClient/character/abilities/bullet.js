define("gameClient/character/abilities/bullet", function () {
	function Bullet () {
		this.sprite = "fireball";

		this.data = {
		    images: ["/characters/fireball.png"],
		    frames: [[0, 15, 18, 28]],
		    animations: {
		    	shoot : [0]
			}		
		}  
		this.frames = 0;
	}
	Bullet.prototype = {
		create : function (obj, createjs) {
			if(!obj[0])return;
			this.bullet = obj[0];
			this.animation = createjs.spriteSheet(this.data, 'shoot');	
			this.animation.x = this.bullet.x;
			this.animation.y = this.bullet.y;
		},
		update : function () {
			if(!this.bullet)return;
			this.frames++;
			this.animation.x = this.bullet.body.getX();
			this.animation.y = this.bullet.body.getY();
		}
	}
	return Bullet;
});