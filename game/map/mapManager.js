define("game/map/mapManager", [], function () {
	function MapManager() {

	}
	MapManager.prototype = {
		init : function () {
			
		},
		initClient : function () {
		},
		initServer : function  () {
			this.mm = require('game/map/mapManagerServer');
			this.mm.init(this);
		}
	}
	return new MapManager;
});