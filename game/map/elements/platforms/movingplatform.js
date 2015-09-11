define("game/map/elements/platforms/movingplatform", function () {
	function Elevator (obj) {
		this.x = 10;
		this.y = 10;
		this.w = 100;
		this.h = 20;
		this.id = 'floor';
		this.type = 'kinematic';
		this.speed = 2;
		this.moveBounds = 300;
		this.friction = 50;

		this.originalX = obj.x;
		this.originalY = obj.y;

		for(var i in obj)this[i] = obj[i];
		this.frames = 0;

		this.direction = true;

		
	}
	Elevator.prototype = {
	 	init : function () {
	 		this.events();
	 	},
	 	events : function () {
	 	},
	 	tickItem : function () {
	 		if(!this.body)return;


	 		this.frames++;


	 		if(this.x > this.originalX + 65 || this.x < this.originalX - this.moveBounds)
	 			this.direction = !this.direction;

	 		this.body.move(this.direction ? 'left' : 'right');

	 	}
	}

	return Elevator;
});