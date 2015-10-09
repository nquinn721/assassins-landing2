function setupRequire (requirejs, io, db, PORT, PLAYERS_ALOUD) {

	requirejs([
		'require',
		'core/ticker',
		'core/body',
		'core/emitter',
		'core/props',
		'core/ping'

	],
	function (requirejs, ticker, body, emitter, props, ping) {
		var GameManager = require('gameManagerServer');
		gameManager = new GameManager(PORT, PLAYERS_ALOUD)
		ticker.start(io);
		// ping.initServer();

	
		io.on('connection', function (socket) {

			require('./gameSocketEvents')(socket, io, emitter, requirejs, db, PORT);
		});
	});
}


module.exports = setupRequire;