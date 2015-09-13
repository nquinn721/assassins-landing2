define("gameClient/map/mapManagerClient", [
		'core/emitter',
		'core/lib/underscore',
		'game/map/elements/platforms/floor',
		'game/map/elements/platforms/wall',
		'game/map/elements/platforms/ceiling',
		'game/map/elements/platforms/elevator',
		'game/map/elements/platforms/movingplatform',
		'gameClient/map/map'
	], function (emitter, _, floor, wall, ceiling, elevator, movingplatform, map) {


	function MapManagerClient() {
		this.mapElements = [];
		this.elements =  {
			floor : floor,
			wall : wall,
			ceiling : ceiling,
			elevator : elevator,
			movingplatform : movingplatform
		}
	}
	MapManagerClient.prototype = {
		init : function () {
			emitter.on('createElement', this.createElement.bind(this));
			emitter.on('destroyElement', this.destroyElement.bind(this));
			emitter.on('tick', this.tick.bind(this));
		},
		createElement : function (obj) {
			var el = new this.elements[obj.obj.elementName](obj.obj);
			el.body  = obj.b2d[obj.obj.b2delement](obj.obj);
			el.init && el.init();
			el.view = map.create(obj.obj);
			this.mapElements.push(el);
		},
		destroyElement : function (id) {
			var obj = this.getById(id);
			obj.item.body.destroy();
			this.mapElements.splice(obj.index, 1);
		},
		getById : function (id) {
			for(var i = 0; i < this.mapElements.length; i++)
				if(this.mapElements[i].id === id)return {item : this.mapElements[i], index : i};
		},

		udpateMapItemCoords : function (mapItems) {
			if(!this.map)return;
			
			for(var i = 0; i < mapItems.length; i++){
				var item = this.getById(mapItems[i].id);
				item.updateCoords(mapItems[i]);
			}
		},
		tick : function () {
			for(var i = 0; i < this.mapElements.length; i++)
				if(this.mapElements[i].tickItem)this.mapElements[i].tickItem();
		}
	}
	return new MapManagerClient;
});