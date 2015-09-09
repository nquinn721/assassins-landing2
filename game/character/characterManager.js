define("game/character/characterManager",[
	'game/character/npc/npcManager', 
	'game/character/player/playerManager',
	'core/emitter'
	], 
	function (npcManager, playerManager, emitter) {
	
	function CharacterManager() {

	}

	CharacterManager.prototype = {
		init : function () {
			npcManager.init();
			playerManager.init();
			this.setupEvents();
		},
		initServer : function () {
			npcManager.initServer();
			playerManager.initServer();
		},
		initClient : function () {
			npcManager.initClient();
			playerManager.initClient();
		},
		setupEvents : function () {
			emitter.on('tick', function () {
				npcManager.tick();
				playerManager.tick();
			});
		}
	}

	return new CharacterManager;
});