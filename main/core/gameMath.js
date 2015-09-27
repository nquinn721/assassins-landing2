define("core/gameMath", function () {
	function GameMath () {
		
	}
	GameMath.prototype = {

		getStep : function (a,b, speed) {
			var distance = this.distance(a,b),
				angle = this.angle(a,b);


			return {
				x : speed * Math.cos(angle),
				y : speed * Math.sin(angle),
				angle : this.angleDeg(angle)
			}
			
		},


		// Returns radians
		angle : function (a, b) {
			var angle = Math.atan2(a[1] - b[1], a[0] - b[0]);
			return angle;
		},
		angleDeg : function (angle) {
			var angleDeg = angle * (360 / (2 * Math.PI));
			return angleDeg;
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