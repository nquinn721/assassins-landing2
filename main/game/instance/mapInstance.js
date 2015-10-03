define("game/instance/mapInstance", [], function () {
	function MapInstance (instance, id, b2d, map) {
		this.instance = instance;
		this.id = id;
		this.b2d = b2d;
		this.map = map;
	}
	MapInstance.prototype = {
		tick : function (io) {
			var dirty = [],
				item;

			for(var i = 0; i < this.map.items.length; i++){
				item = this.map.items[i];
				if(item.isDirty){
					dirty.push({id : item.id, hp : item.hp});
					item.isDirty = false;
				}
			}

			if(dirty.length){
				this.checkWin(dirty);
				io.in(this.id).emit('mapItemsHP', dirty);
			}

			this.updateCoords(io);
		},
		updateCoords : function (io) {
			var itemCoords = [];
			for(var i = 0; i < this.map.items.length; i++){
				var item = this.map.items[i];
				if(item.type === 'kinematic'){
					itemCoords.push({x : item.x, y : item.y, id : item.id});
				}

			}

			io.emit('mapCoords', itemCoords);
			
		},
		checkWin : function (items) {
			for(var i = 0; i < items.length; i++){
				var item = items[i];
				if(item.id.match('base')){
					if(item.hp < 0){
						this.instance.endGame(item.id === 'base0' ? 'base1' : 'base0');
					}
				}
			}
		}
	}
	return MapInstance;
});