define("game/map/mapManager", [], function () {
	function MapManager() {

	}
	MapManager.prototype = {
		init : function () {
			
		},
		initClient : function () {
			var self = this;
			require(['game/map/mapManagerClient'], function  (mm) {
				self.mm = mm;
				self.mm.init(self);
			});
		},
		initServer : function  () {
			this.mm = require('game/map/mapManagerServer');
			this.mm.init(this);
		}
	}
	return new MapManager;
});