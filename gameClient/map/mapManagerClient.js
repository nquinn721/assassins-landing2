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
		createMap : function (obj) {
			require(['game/map/maps/' + obj.map], function (m) {
				var map = new Map;
				map.init(m, obj.b2d, obj.user);
			});
		}
	}
	return new MapManagerClient;
});