define("game/gameManager", [
	"game/character/characterManager",
	"game/map/mapManager"
	], function (characterManager, mapManager) {

	var serverManagerClasses = [characterManager, mapManager],
		clientManagerClasses = [characterManager];

	function GameManager() {

	}
	GameManager.prototype = {
		init : function () {
		},
		initServer : function () {
			for (var i = serverManagerClasses.length - 1; i >= 0; i--) {
				serverManagerClasses[i].init();
				serverManagerClasses[i].initServer();
			};
		},
		initClient : function () {
			for (var i = clientManagerClasses.length - 1; i >= 0; i--) {
				clientManagerClasses[i].init();
				clientManagerClasses[i].initClient();
			};	
		}
	}
	return new GameManager;
});
