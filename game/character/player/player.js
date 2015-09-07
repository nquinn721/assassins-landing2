if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define("game/character/player/player", [], function () {
	function Player (obj) {
		this.x = 10;
		this.y = 10;
		this.w = 50;
		this.h = 100;
		this.id = 'player';
		this.speed = 5;


		// Client Classes
		this.client = {};


		// Property overrides
		for(var i in obj)
			this[i] = obj[i];


		this.frames = 0;
	}

	Player.prototype = {
		init : function (b2d) {
			this.body = b2d.rect({
				x : this.x,
				y : this.y,
				w : this.w,
				h : this.h
			});
		},
		initClient : function (obj) {
			for(var i in obj)
				this.client[i] = obj[i];
		},
		initServer : function () {
			
		},
		tick : function () {
			this.x = this.body.getX();
			this.y = this.body.getY();
			
			this.frames++;

			for(var i in this.client)
				if(this.client[i].tick)this.client[i].tick(this);
		},
		move : function (dir) {
			this.body.move(dir);
		},
		jump : function () {
			this.body.ap
		},
		destroy : function  () {
			this.body.destroy();
		},
		obj : function () {
			return {
				x : this.x,
				y : this.y,
				w : this.w,
				h : this.h,
				id : this.id,
				speed : this.speed
			}
		}
	}
	return Player;
});