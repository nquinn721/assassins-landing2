function setupRequire (requirejs, io) {
	var url = '../server/lib/',
		currentInstance = 0,
		totalSockets = 0,
		created;
	
	requirejs([
		'core/ticker',
		'core/body',
		'core/emitter',
		'game/instance/instanceManager',
		'game/gameManager',
		'core/props'

	],
	function (ticker, body, emitter, instanceManager, gameManager, props) {
		var instance = instanceManager.createInstance(); 
		io.on('connection', function (socket) {

			if(totalSockets % 2 === 0 && totalSockets !== 0){
				console.log('create');
				instance = instanceManager.createInstance();
			}
			socket.instance = instance;
			socket.join(socket.instance.id);

			
			socket.on('login', function () {
				totalSockets++;
				ticker.start();
				emitter.emit('createUser', socket);
				emitter.emit('createMap', socket);
				socket.emit('map' , socket.instance.map);
			});


			socket.on('keyup', function (keyCode) {
				if(socket.player){
					socket.player.keyUp(keyCode);
					socket.broadcast.to(socket.instance.id).emit('keyup',{player : socket.user, keyCode : keyCode});
				}
			});
			socket.on('keydown', function (keyCode) {
				if(socket.player){
					socket.player.keyDown(keyCode);
					socket.broadcast.to(socket.instance.id).emit('keydown',{player : socket.user, keyCode : keyCode});
				}

			});

			socket.on('disconnect', function () {
				if(socket.user){
					io.in(socket.instance.id).emit('destroyPlayer', socket.user);
					socket.instance.removePlayer(socket.user);
					emitter.emit('destroyPlayer', socket.user);
					totalSockets--;
				}
			});
		});

		gameManager.init();
		gameManager.initServer();
		
	});
}


module.exports = setupRequire;