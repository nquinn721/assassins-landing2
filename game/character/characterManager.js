define("game/character/characterManager",[
	'game/character/player/playerManagerServer',
	], 
	function (playerManagerServer) {
	
	function CharacterManager() {

	}

	CharacterManager.prototype = {
		init : function () {
			playerManagerServer.init();
		}
	}

	return new CharacterManager;
});