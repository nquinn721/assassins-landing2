define("gameClient/gameManagerClient", [
		"require",
		"core/emitter"
	], function (require, emitter) {
	function GameManagerClient () {
		
	}

	GameManagerClient.prototype = {
		init : function () {
			emitter.on('gameSetup', this.setup.bind(this));
			
		},
		setup : function () {
			require([
				"gameClient/character/characterManagerClient",
				"gameClient/map/mapManagerClient"
			], function (characterManagerClient, mapManagerClient) {
				characterManagerClient.init();
				mapManagerClient.init();
				
			})
		},
		startEvents : function () {
			require(['gameClient/events']);
		}
	}

	return new GameManagerClient;
})