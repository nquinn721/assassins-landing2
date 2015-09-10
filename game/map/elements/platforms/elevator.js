define("game/map/elements/platforms/elevator", ['core/emitter'], function (emitter) {
	function Elevator (obj) {
		this.x = 10;
		this.y = 10;
		this.w = 100;
		this.h = 20;
		this.id = 'floor';
		this.type = 'kinematic';
		this.speed = 1;

		for(var i in obj)this[i] = obj[i];


		this.frames = 0;

		this.frameBound = 100;
		this.direction = false;

		
	}
	Elevator.prototype = {
	 	init : function () {
	 		this.events();
	 	},
	 	events : function () {
	 		emitter.on('tick', this.tick.bind(this));
	 	},
	 	tick : function () {
	 		if(!this.body)return;

	 		this.frames++;

	 		if(this.frames % this.frameBound === 0)
	 			this.direction = !this.direction;

	 		this.body.move(this.direction ? 'up' : 'down');
	 	}
	}

	return Elevator;
});