define("game/map/elements/platforms/elevator", function () {
	function Elevator () {
		this.x = 10;
		this.y = 10;
		this.w = 100;
		this.h = 20;
		this.id = 'floor';
		this.type = 'kinematic';
		this.policies = ['floor', 'elevator'];
		this.speed = 2;
		this.moveBounds = 300;
		this.b2delement = 'rect';
		this.elementName = 'elevator';
		this.categoryBits = 0x0001;

		


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
	 		if(this.y >= this.originalY + 10 || this.y <= this.originalY - this.moveBounds)
	 			this.direction = !this.direction;

	 		this.body.move(this.direction ? 'up' : 'down');

	 	}
	}

	return Elevator;
});