define("gameClient/gameManagerClient", [
		"gameClient/character/characterManagerClient",
		"gameClient/map/mapManagerClient"
	], function (characterManagerClient, mapManagerClient) {
	function GameManagerClient () {
		
	}

	GameManagerClient.prototype = {
		init : function () {
			characterManagerClient.init();
			mapManagerClient.init();
		}
	}

	return new GameManagerClient;
})