define("game/gameManager", [
	"game/character/characterManager",
	"game/map/mapManagerServer"
	], function (characterManager, mapManagerServer) {


	function GameManager() {

	}
	GameManager.prototype = {
		init : function () {
			characterManager.init();
			mapManagerServer.init();
		}
	}
	return new GameManager;
});
