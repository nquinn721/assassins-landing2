function setupRequire (requirejs, io, db, PORT, PLAYERS_ALOUD) {

	requirejs([
		'require',
		'core/ticker',
		'core/body',
		'core/emitter',
		'core/props',
		'core/ping',
		'gameServer/gameManagerServer',
		'core/prototype'

	],
	function (requirejs, ticker, body, emitter, props, ping, GameManagerServer) {
		var gameManagerServer = new GameManagerServer(io, PLAYERS_ALOUD, db, PORT);
		gameManagerServer.init();
		ticker.start(io);
		// ping.initServer();

		io.on('connection', function (socket) {
			require('./gameSocketEvents')(
				socket, 
				io, 
				emitter, 
				requirejs, 
				db, 
				PORT,
				gameManagerServer
			);
		});
	});
}


module.exports = setupRequire;