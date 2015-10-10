if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['game/character/npc/npc'], function (npc) {
	function NPCManager () {
		this.npcs = [];
	}

	NPCManager.prototype = {
		init : function () {
			
		},
		initServer : function () {
			
		},
		initClient : function () {
			
		},
		tick : function () {
			for(var i = 0; i < this.npcs.length; i++)
				npcs[i].tick();
		},
		createNPC : function (obj) {
			var npc = new NPC(obj);
			this.npcs.push()
		}
	}

	return new NPCManager;
})