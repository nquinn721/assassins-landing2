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
			emitter.on('serverTick', this.tick.bind(this));
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
			socket.emit('start', {map : items, players : players, user : socket.user});
			socket.broadcast.to(this.id).emit('createPlayer', player.obj());
		},
		tick : function (io) {
			this.frames++;
			
			this.updateCoords(io, this.players, items);

		},
		updateCoords : function(io, players, items) {
			if(!this.emitCoords)return;

			var playerCoords = [];
			for(var i = 0; i < players.length; i++){
				var p = players[i];
				if(!p)continue;
				if(p.left)p.x -= ping.average / 1000;
				if(p.right)p.x += ping.average / 1000;
				if(p.jumping)p.y  -= ping.average / 1000;
				playerCoords.push({x : p.x, y : p.y + 50, id : p.id});
			}
			io.in(this.id).emit('coords', {players : playerCoords});

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