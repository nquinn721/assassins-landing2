define("game/map/map", [
		'core/emitter', 
		'core/props', 
		'game/map/elements/element',
		'game/map/matrix',
		'game/map/elements/platforms/floor',
		'game/map/elements/platforms/elevator',
		'game/map/elements/platforms/movingplatform'
	], function (emitter, props, Element, Matrix, floor, elevator, movingplatform) {
	function Map() {
		this.map;
	}
	Map.prototype = {
		init : function (map, b2d, user) {
			this.elements = {
				floor : floor,
				elevator : elevator,
				movingplatform : movingplatform
			}
			this.map = map;
			this.user = user;
			this.b2d = b2d;
			this.element = new Element;
			this.matrix = new Matrix(this.elements);

			this.readMatrix();

			this.create();
			this.createWalls();
			this.events();
		},
		events : function () {
			emitter.on('playerCoords', this.update.bind(this));
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

				if(this.isWithinDistance(item)){
					item.show(this.b2d);
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
				if(!item.displayed){
					if(this.isWithinDistance(item)){
						item.show(this.b2d);
					}
				}else{
					if(!this.isWithinDistance(item)){
						item.hide();
					}
				}

			}
		},
		isWithinDistance : function (item) {
			if(
				item.x + item.w >= this.user.x - props.mapShowingDistance && 
				item.x <= this.user.x + props.mapShowingDistance && 
				item.y + item.h >= this.user.y - props.mapShowingDistance && 
				item.y <= this.user.y + props.mapShowingDistance
			)return true;
			return false;
		},
		createWalls : function () {
			this.b2d.rect({w : props.canvas.w, h : 20, x : 0, y : props.canvas.h - 20, type : 'static', id : 'floor'});
			this.b2d.rect({w : props.canvas.w, h : 20, x : 0, y : 0, type : 'static'});
			this.b2d.rect({w : 20, h : props.canvas.h, x : 0, y : 0, type : 'static'});
			this.b2d.rect({w : 20, h : props.canvas.h, x : props.canvas.w - 20, y : 0, type : 'static'});
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
			for(var i = 0; i < this.map.items.length; i++)
				if(this.map.items[i].tick)this.map.items[i].tick();
		}
	}
	return Map;
});