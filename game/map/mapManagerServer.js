define("game/map/mapManagerServer", [
		'core/emitter', 
		'game/map/map'
	], function (emitter, Map) {


	function MapManagerServer() {

	}
	MapManagerServer.prototype = {
		init : function () {
			emitter.on('createMap', this.createMap.bind(this));
			emitter.on('destroyMap', this.destroyMap.bind(this));
		},
		createMap : function (socket) {
			if(socket.instance.map){
				socket.emit('map', socket.instance.mapName);
				return;
			}

			var m = require("game/map/maps/" + socket.instance.mapName);
			socket.instance.map = new Map(socket);
			socket.instance.map.init(m, socket.instance.b2d, socket);
			socket.emit('map', socket.instance.mapName);
		},
		extendItemsWithElement : function (item) {
			for(var i in this.element)
				item[i] = this.element[i];
		},
		destroyMap : function (map) {
			// map.destroy();
		}
	}
	return new MapManagerServer;
});