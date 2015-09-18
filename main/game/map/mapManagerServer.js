define("game/map/mapManagerServer", ['core/emitter'], function (emitter) {
	function MapManagerServer() {

	}
	MapManagerServer.prototype = {
		init : function () {
			// emitter.on('createMap', this.createMap.bind(this));
		},
		createMap : function (socket) {
			var m = require("game/map/maps/" + socket.instance.mapName);
			socket.instance.map = new Map();
			socket.instance.map.init(m, socket.instance.b2d, socket);
		}
	}
	return new MapManagerServer;
});