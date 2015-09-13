define("game/map/elements/platforms/elevator", function () {
	function Elevator (obj) {
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

	 		if(this.y >= this.originalY + 10 || this.y <= this.originalY - this.moveBounds)
	 			this.direction = !this.direction;

	 		this.body.move(this.direction ? 'up' : 'down');
	 	}
	}

	return Elevator;
});