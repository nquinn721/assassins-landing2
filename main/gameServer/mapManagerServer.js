define("gameServer/mapManagerServer", [], function () {
	function MapManagerServer () {
		this.frames = 0;
	}
	MapManagerServer.prototype = {
		init : function (manager) {
			this.manager = manager;
		},
		tick : function () {
			if(!this.manager.map.items)return;
			this.frames++;

			this.updateMapCoords();

			this.checkDirty();
		},
		updateMapCoords : function () {
			var itemCoords = [];

			for(var i = 0; i < this.manager.map.items.length; i++){
				var item = this.manager.map.items[i];
				if(item.type === 'kinematic' || item.type === 'dynamic'){
					itemCoords.push({x : item.x, y : item.y, id : item.id});
				}

			}

			this.manager.io.emit('mapCoords', itemCoords);
		},
		checkDirty : function () {
			var dirty = [],
				item;

			for(var i = 0; i < this.manager.map.items.length; i++){
				item = this.manager.map.items[i];
				if(item.isDirty){
					dirty.push({id : item.id, hp : item.hp});
					item.isDirty = false;
				}
			}

			if(dirty.length){
				this.checkWin(dirty);
				this.manager.io.emit('mapItemsHP', dirty);
			}
		},
		checkWin : function (items) {
			for(var i = 0; i < items.length; i++){
				var item = items[i];
				if(item.id.match('base')){
					if(item.hp < 0){
						this.manager.endGame(item.id === 'base0' ? 'base1' : 'base0');
					}
				}
			}
		}

		
	}
	return new MapManagerServer;
})