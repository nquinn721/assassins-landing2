define("js/socket", ["core/emitter", "core/b2d"], function (emitter, b2d) {
	return {
		createUser : function(player){
			createjs.ticker();
			emitter.emit('createUser', {player : player, b2d : b2d});
		},
		createPlayer : function (player) {
			emitter.emit('createPlayer', {player : player, b2d : b2d});
		},
		destroyPlayer : function (player) {
			emitter.emit('destroyPlayer', {player : player, b2d : b2d});
		}
	}
})