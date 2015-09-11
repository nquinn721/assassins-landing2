define("gameClient/map/mapManagerClient", [
		'require', 
		'core/emitter'
	], function (require, Map, emitter) {


	function MapManagerClient() {

	}
	MapManagerClient.prototype = {
		init : function () {
		},
		createFloor : function (socket) {
		},
		udpateMapItemCoords : function (mapItems) {
			if(!this.map)return;
			
			for(var i = 0; i < mapItems.length; i++){
				var item = this.map.getById(mapItems[i].id);
				item.updateCoords(mapItems[i]);
			}
		}
	}
	return new MapManagerClient;
});