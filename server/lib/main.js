function setupRequire (requirejs, io, db) {

	requirejs([
		'require',
		'core/ticker',
		'core/body',
		'core/emitter',
		'game/instance/instanceManager',
		'game/gameManager',
		'core/props',
		'core/ping'

	],
	function (req, ticker, body, emitter, instanceManager, gameManager, props, ping) {
		instanceManager.init(io);
		gameManager.init();
		ticker.start(io);
		// ping.initServer();

	
		io.on('connection', function (socket) {

			require('./gameSocketEvents')(socket, io, instanceManager, emitter, req);
		});
	});
}


module.exports = setupRequire;