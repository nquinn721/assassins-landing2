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
		this.frames = 0;
		
		// Players
		this.totalPlayers = 0;
		this.players = [];

		// Emit Coords
		this.emitCoords = false;

		// Parent
		this.instanceManager = instanceManager;
	}

	Instance.prototype = {
		init : function () {
			// emitter.on('serverTick', this.tick.bind(this));
		},
		full : function () {
			if(this.totalPlayers >= props.playersAloudInInstance)
				return true;
		},
		join : function (player, socket) {
			this.updatePlayers(player, socket);
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
		updatePlayers : function (player, socket) {
			var players = this.players.map(function(v){return v.obj()});
				items = this.map.items.map(function(v){return v.obj()});
			socket.emit('build', {map : items, players : players});
			socket.broadcast.to(this.id).emit('createPlayer', player.obj());
		},
		tick : function (io) {
			// if(!this.map)return;

			// var playerCoords = [],
			// 	items = this.map.items,
			// 	players = this.players;

			// this.frames++;
			


			// this.sendMapItemsToPlayersWithinRange(io, players, items);

		},
		sendMapItemsToPlayersWithinRange : function(io, players, items) {

			// for(var i = 0; i < players.length; i++){
			// 	var player = players[i],
			// 		itemCoords = [],
			// 		playerCoords = [];

				// Visible Items
				// for(var j = 0; j < items.length; j++){
				// 	var item = items[j],
				// 		inRange = this.checkIfItemIsInRange(player, item),
				// 		visible = this.checkIfItemIsVisibleAlready(player, item);

				// 	if(inRange && !visible){
				// 		player.addVisibleItem(item);
				// 		this.emitToPlayer(io, player, 'createElement', item.obj());
				// 	}else if(visible && !inRange){
				// 		player.removeVisibleItem(item);
				// 		this.emitToPlayer(io, player, 'destroyElement', item.id);
				// 	}
				// }

				// // Visible Players
				// for(var k = 0; k < players.length; k++){
				// 	var p = players[k];
				// 	if(p.id === player.id)continue;

				// 	var inRange = this.checkIfItemIsInRange(player, p),
				// 		visible = this.checkIfItemIsVisibleAlready(player, p);

				// 	console.log(visible, inRange, id);
				// 	if(inRange && !visible){
				// 		player.addVisibleItem(p);
				// 		this.emitToPlayer(io, player, 'createPlayer', p.obj());
				// 	}else if(visible && !inRange){
				// 		player.removeVisibleItem(p);
				// 		this.emitToPlayer(io, player, 'destroyPlayer', p.obj());
				// 	}
				// }


				// Emit updated coords to client
			// 	if(this.emitCoords){
			// 		var visiblePlayers = player.getVisiblePlayers();
			// 		for(var l = 0; l < visiblePlayers.length; l++){
			// 			var p = visiblePlayers[l];
			// 			if(!p)continue;
			// 			if(p.left)p.x -= ping.average / 1000;
			// 			if(p.right)p.x += ping.average / 1000;
			// 			playerCoords.push({x : p.x, y : p.y, id : p.id});
			// 		}
			// 		playerCoords.push({x : player.x, y : player.y, id : player.id});

			// 		// var visibleItems = player.getVisibleItems();
			// 		// for(var p = 0; p < visibleItems.length; p++){
			// 		// 	var item = visibleItems[i];
			// 		// 	if(item.type === 'kinematic')
			// 		// 		itemCoords.push({x : item.x, y : item.y, id : item.id });
			// 		// }

			// 		this.emitToPlayer(io, player, 'coords', {players : playerCoords, mapItems : itemCoords});
			// 	}
			// }
		},
		emitToPlayer : function (io, player, event, data) {
			if(player && io.sockets.connected[player.socketId])
				io.sockets.connected[player.socketId].emit(event, data);
		},
		checkIfItemIsVisibleAlready : function (player, item) {
			return player.hasVisibleItem(item);
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