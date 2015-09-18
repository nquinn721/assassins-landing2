define("game/map/map", [
		'core/emitter', 
		'core/props',
		'game/map/elements/element',
		'game/map/matrix',
		
	], function (emitter, props, element, matrix) {

	

	function Map(mapName, b2d) {
		var Map = require("game/map/maps/" + mapName);
		this.map = new Map;
		
		this.b2d = b2d;

		this.frames = 0;
		this.items = [];
	}
	Map.prototype = {
		init : function () {
			this.readMatrix();
			this.create();
			this.events();
		},
		events : function () {
			emitter.on('tick', this.tick.bind(this));
		},
		create : function () {
			if(this.map.init)this.map.init();

			for(var i = 0; i < this.items.length; i++){
				var item = element.extend(this.items[i]);

				item.initItem(this.b2d);
			}
		},
		

		getById : function (id) {
			for(var i = 0; i < this.map.items.length; i++)
				if(this.map.items[i].id === id)return this.map.items[i];
		},
		readMatrix : function () {
			this.items = matrix.map(this.map.matrix);
		},
		tick : function () {
			for(var i = 0; i < this.items.length; i++)
				if(this.items[i].tick)this.items[i].tick();
		}
	}
	return Map;
});