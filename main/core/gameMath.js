define("core/gameMath", function () {
	function GameMath () {
		
	}
	GameMath.prototype = {

		getStep : function (a,b, speed) {
			var distance = this.distance(a,b),
				angle = this.angle(a,b),
				y = speed * Math.sin(angle),
				x = speed * Math.cos(angle),
				angleDeg = this.angleDeg(distance, angle);


			return {
				x : x,
				y : y,
				angle : y < 0 ?  angleDeg: 360 - angleDeg,
				spriteAngle : (this.spriteAngle(a,b))
			}
			
		},


		// Returns radians
		angle : function (a, b) {
			var angle = Math.atan2(a[1] - b[1], a[0] - b[0]);
			return angle;
		},
		spriteAngle : function (a, b) {
			var angle = Math.atan2(a[1] - b[1], a[0] - b[0] );
			angle = angle * (180/Math.PI);
			 if(angle < 0)
	            angle = 360 - (-angle);
	        angle += 90;
			return angle;
		},
		angleDeg : function (distance, angle) {
			var angleDeg = angle * (360 / (2 * Math.PI));
			return Math.abs(angleDeg);
		},
		distance : function (a, b) {
			var x = this.square(a[0] - b[0]),
				y = this.square(a[1] - b[1]);
			return Math.sqrt(x + y);
		},
		square : function (a) {
			return a * a;
		}

	}
	return new GameMath;
});