define("game/map/mapManagerServer", [
		'core/emitter', 
		'game/map/map'
	], function (emitter, Map) {


	function MapManagerServer() {

	}
	MapManagerServer.prototype = {
		init : function () {
			emitter.on('createMap', this.createMap.bind(this));
		},
		createMap : function (socket) {
			var m = require("game/map/maps/" + socket.instance.map),
				map = new Map;
			map.init(m, socket.instance.b2d, socket.user);
		}
	}
	return new MapManagerServer;
});