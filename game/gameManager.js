define("game/gameManager", [
	"game/character/characterManager",
	"game/map/mapManager"
	], function () {


	var managerClasses = [];

	for(var i in arguments)
		managerClasses.push(arguments[i]);



	function GameManager() {

	}
	GameManager.prototype = {
		init : function () {
		},
		initServer : function () {
			for (var i = managerClasses.length - 1; i >= 0; i--) {
				managerClasses[i].init();
				managerClasses[i].initServer();
			};
		},
		initClient : function () {
			for (var i = managerClasses.length - 1; i >= 0; i--) {
				managerClasses[i].init();
				managerClasses[i].initClient();
			};	
		}
	}
	return new GameManager;
});
