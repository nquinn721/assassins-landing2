define("game/map/map", [
		'core/emitter', 
		'core/props',
		'core/wallsAndFloors',
		'game/map/elements/element',
		'game/map/matrix',
		'game/map/elements/platforms/floor',
		'game/map/elements/platforms/wall',
		'game/map/elements/platforms/ceiling',
		'game/map/elements/platforms/elevator',
		'game/map/elements/platforms/movingplatform'
	], function (emitter, props, wallsAndFloors, Element, Matrix, floor, wall, ceiling, elevator, movingplatform) {
	function Map(socket) {
		this.map;
		this.socket = socket;
		this.frames = 0;
	}
	Map.prototype = {
		init : function (map, b2d, user) {
			this.elements = {
				floor : floor,
				wall : wall,
				ceiling : ceiling,
				elevator : elevator,
				movingplatform : movingplatform
			}
			this.map = map;
			this.user = user.player;
			this.b2d = b2d;
			this.element = new Element;
			this.matrix = new Matrix(this.elements);

			this.readMatrix();

			this.createWalls();

			this.create();
			this.events();
		},
		events : function () {
			emitter.on('tick', this.tick.bind(this));
		},
		extendItemsWithElement : function (item) {
			for(var i in this.element)
				item[i] = this.element[i];
		},
		create : function () {
			if(this.map.init)this.map.init();

			for(var i = 0; i < this.map.items.length; i++){
				var item = this.map.items[i];

				this.extendItemsWithElement(item);

				if(item.init)item.init();

				item.create(this.b2d);

				if(this.userIsWithinDistance(item)){
					item.show(this.socket);
				}			
			}
		},
		destroy : function () {
			for(var i = 0; i < this.map.items.length; i++)
				this.map.items[i].hide();
		},
		update : function () {
			
			for(var i = 0; i < this.map.items.length; i++){
				var item = this.map.items[i];

				if(!item.isVisible){
					if(this.userIsWithinDistance(item)){
						item.show(this.socket);
					} 
				} else if(!this.userIsWithinDistance(item)){
					item.hide(this.socket);
				}

			}
			this.frames++;
		},
		userIsWithinDistance : function (item) {
			if(
				item.x + item.w >= this.user.x - props.mapShowingDistance && 
				item.x <= this.user.x + props.mapShowingDistance && 
				item.y + item.h >= this.user.y - props.mapShowingDistance && 
				item.y <= this.user.y + props.mapShowingDistance
			)return true;
			return false;
		},
		createWalls : function () {
			// for(var i = 0; i < wallsAndFloors.length; i++)
			// 	this.b2d.rect(wallsAndFloors[i]);
		},

		getById : function (id) {
			for(var i = 0; i < this.map.items.length; i++)
				if(this.map.items[i].id === id)return this.map.items[i];
		},
		readMatrix : function () {
			this.matrix.map(this.map.matrix);
			this.map.items = this.matrix.items;
			for(var i = 0; i < this.map.items.length; i++)
				this.map.items[i] = new this.elements[this.map.items[i].element](this.map.items[i]);

		},
		tick : function () {
			this.update();
			for(var i = 0; i < this.map.items.length; i++)
				if(this.map.items[i].tick)this.map.items[i].tick();
		}
	}
	return Map;
});