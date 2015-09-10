define("game/instance/instance", ["core/emitter"], function (emitter) {
	function Instance (instanceManager, obj) {
		this.b2d = obj.b2d;
		this.mapName = obj.mapName;
		this.id = obj.id;

		// Players
		this.totalPlayers = 0;
		this.players = [];

		// Parent
		this.instanceManager = instanceManager;
	}

	Instance.prototype = {
		addPlayer : function (player) {
			this.players.push(player);
			this.totalPlayers++;
		},
		removePlayer : function (player) {
			for(var i = 0; i < this.players.length; i++)
				if(this.players[i].id === player.id)
					this.players.splice(i, 1);

			this.totalPlayers--;

			if(this.totalPlayers === 0){
				emitter.emit('destroyMap', this.map);
				this.instanceManager.destroyInstance(this);
			}
		}
	}

	return Instance;
});