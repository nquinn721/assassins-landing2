if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function () {
	function NPC (obj) {
		this.x = obj.x || 10;
		this.y = obj.y || 10;
		this.w = obj.w || 10;
		this.h = obj.h || 10;
		this.id = obj.id || 'npc';
		this.speed = obj.speed || 5;

		this.frames = 0;
	}

	NPC.prototype = {
		init : function (instance) {
			this.body = instance.rect({
				x : this.x,
				y : this.y,
				w : this.w,
				h : this.h
			});

		},
		initClient : function () {
			
		},
		initServer : function () {
			
		},
		tick : function () {
			
		},
		move : function (dir) {
			this.body.move(dir);
		},
		obj :function () {
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

	return NPC;
});