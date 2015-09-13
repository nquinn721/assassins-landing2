define("game/instance/instance", [
		"core/emitter", 
		"core/props",
		"core/ping"
	], function (emitter, props, ping) {

	function Instance (instanceManager, obj) {
		this.b2d = obj.b2d;
		this.mapName = obj.mapName;
		this.id = obj.id;
		this.map = obj.map;
		
		// Players
		this.totalPlayers = 0;
		this.players = [];

		// Parent
		this.instanceManager = instanceManager;
	}

	Instance.prototype = {
		init : function () {
			emitter.on('serverTick', this.tick.bind(this));
		},
		full : function () {
			if(this.totalPlayers >= props.playersAloudInInstance)
				return true;
		},
		join : function (player) {
			this.players.push(player);
			this.totalPlayers++;
		},
		leave : function (player) {
			for(var i = 0; i < this.players.length; i++)
				if(this.players[i].id === player.id)
					this.players.splice(i, 1);

			this.totalPlayers--;

			if(this.totalPlayers === 0){
				this.instanceManager.destroyInstance(this);
			}
		},
		tick : function (io) {
			if(!this.map)return;

			var playerCoords = [],
				itemCoords = [],
				items = this.map.items,
				players = this.players;


			// for(var i = 0; i < items.length; i++){
			// 	var item = items[i];
			// 	if(item.type === 'kinematic')
			// 		itemCoords.push({x : item.x, y : item.y, id : item.id });
			// }

			// for(var i = 0; i < players.length; i++){
			// 	var p = players[i];
			// 	if(p.left)p.x -= ping.average / 1000;
			// 	if(p.right)p.x += ping.average / 1000;
			// 	playerCoords.push({x : p.x, y : p.y, id : p.id});
			// }

			// io.in(this.id).emit('coords', {players : playerCoords, mapItems : itemCoords});

			this.sendMapItemsToPlayersWithinRange(io, players, items);

		},
		sendMapItemsToPlayersWithinRange : function(io, players, items) {
			for(var i = 0; i < players.length; i++){
				var player = players[i];

				for(var j = 0; j < items.length; j++){
					var item = items[j];

					if(!item.isVisible()){
						if(this.checkIfItemIsInRange(player, item)){
							item.show();
							this.emitToPlayer(io, players[i], 'createElement', items[j].obj());
						}
					}else if(item.isVisible()){
						if(!this.checkIfItemIsInRange(player, item)){
							item.hide();
							this.emitToPlayer(io, players[i], 'destroyElement', items[j].obj());
						}
					}
				}
			}
		},
		emitToPlayer : function (io, player, event, data) {
			io.sockets.connected[player.socketId].emit(event, data);
		},
		checkIfItemIsInRange : function (player, item) {
			if(
				item.x + item.w >= player.x - props.mapShowingDistance && 
				item.x <= player.x + props.mapShowingDistance && 
				item.y + item.h >= player.y - props.mapShowingDistance && 
				item.y <= player.y + props.mapShowingDistance
			)return true;
			return false;
		}
	}

	return Instance;
});