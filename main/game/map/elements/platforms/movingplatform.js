define("game/map/elements/platforms/movingplatform", function () {
	function Elevator () {
		this.x = 10;
		this.y = 10;
		this.w = 100;
		this.h = 20;
		this.id = 'floor';
		this.type = 'kinematic';
		this.groupId = 1;
		this.speed = 2;
		this.moveBounds = 300;
		this.friction = 50;
		this.policies = ['floor', 'movingplatform'];
		this.b2delement = 'rect';
		this.elementName = 'movingplatform';

		

		this.frames = 0;

		this.direction = true;

		
	}
	Elevator.prototype = {
		init : function () {
			this.originalX = this.x;
			this.originalY = this.y;
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