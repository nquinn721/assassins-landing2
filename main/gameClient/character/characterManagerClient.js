define("gameClient/character/characterManagerClient", [
		"gameClient/character/player/playerManagerClient"
	], function (playerManagerClient) {
	function CharacterManagerClient () {
		
	}

	CharacterManagerClient.prototype = {
		init : function () {
			playerManagerClient.init();
		}
	}
	return new CharacterManagerClient;
})