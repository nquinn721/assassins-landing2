define("gameClient/character/abilities/bullet", function () {
	function Bullet (obj) {
		this.sprite = "fireball";

		this.data = {
		    images: ["/characters/fireball.png"],
		    frames: [[0, 15, 14, 20], [0,0,14,20]],
		    animations: {
		    	shoot : [0],
		    	explode : [0, 1, 0]
			}		
		}  
		this.frames = 0;
		
		this.bullet = obj;
	}
	Bullet.prototype = {
		create : function (stage) {
			this.animation = stage.spriteSheet(this.data, 'shoot');	
			this.animation.x = this.bullet.x;
			this.animation.y = this.bullet.y;
		},
		update : function () {
			if(!this.bullet)return;
			this.frames++;
			this.animation.x = this.bullet.body.getX();
			this.animation.y = this.bullet.body.getY();
			this.animation.rotation = this.bullet.step.spriteAngle;
		},
		destroy : function (stage) {
			var self = this;
			this.animation.gotoAndPlay('explode');
			setTimeout(function () {
				stage.destroy(self.animation);
			}, 200)

		}
	}
	return Bullet;
});