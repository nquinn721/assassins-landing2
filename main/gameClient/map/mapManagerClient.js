define("gameClient/map/mapManagerClient", [
		'core/emitter',
		'core/props',
		'gameClient/map/map',
		'gameClient/character/player/playerManagerClient'
	], function (emitter, props, map, pm) {


	function MapManagerClient() {
		this.mapElements = [];
	}
	MapManagerClient.prototype = {
		init : function () {
			this.events();
		},
		events : function () {
			emitter.on('createMap', this.createMap.bind(this));
			// emitter.on('createElement', this.createElement.bind(this));
			// emitter.on('destroyElement', this.destroyElement.bind(this));
			emitter.on('mapCoords', this.udpateMapItemCoords.bind(this));
			emitter.on('tick', this.tick.bind(this));
		},
		createElement : function (obj) {
			var el = map.create(this.b2d, obj);
			this.mapElements.push(el);
		},
		createMap : function (obj) {
			this.b2d = obj.b2d;
			for(var i = 0; i < obj.map.length; i++){
				this.createElement(obj.map[i]);
			}
		},
		destroyElement : function (item) {
			item.destroy();
			this.mapElements.splice(this.mapElements.indexOf(item), 1);
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
			var user = pm.getUser();

			for(var i = 0; i < this.mapElements.length; i++){
				var item = this.mapElements[i],
					inRange = user.checkIfItemIsInRange(item),
					visible = user.hasVisibleItem(item);

				if(item.tick)item.tick();
				if(item.el.tickItem)item.el.tickItem();


				

				if(inRange && !visible){
					console.log('create');
					this.createElement(item);
					user.addVisibleItem(item);
				}else if(visible && !inRange){
					console.log('destroy');
					this.destroyElement(item)
					user.removeVisibleItem(item);
				}

			}
		}
	}
	return new MapManagerClient;
});