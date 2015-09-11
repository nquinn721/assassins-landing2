define("gameClient/map/mapManagerClient", [
		'require', 
		'game/map/map', 
		'core/emitter'
	], function (require, Map, emitter) {


	function MapManagerClient() {

	}
	MapManagerClient.prototype = {
		init : function () {
			emitter.on('createMap', this.createMap.bind(this));
		},
		createMap : function (socket) {
			require(['game/map/maps/' + socket.map], function (m) {
				var map = new Map;
				map.init(m, socket.b2d, socket.player);
			});
		}
	}
	return new MapManagerClient;
});