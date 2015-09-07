function setupRequire (requirejs, io) {
	var url = '../server/lib/',
		currentInstance = 0,
		totalSockets = 0,
		created;
	
	requirejs([
		'core/ticker',
		'core/body',
		'core/emitter',
		'core/instance',
		'game/character/characterManager',
		'core/props'

	],
	function (ticker, body, emitter, instance, characterManager, props) {
		io.on('connection', function (socket) {
			if(totalSockets >= 2 && !created){
				instance.createInstance();
				currentInstance++;
				created = true;
			}
			socket.instance = instance.get(currentInstance);
			console.log(currentInstance);
			socket.join(socket.instance.id);

			socket.instance.b2d.rect({w : props.canvas.w, h : 20, x : 0, y : props.canvas.h - 20, type : 'static'});
			socket.instance.b2d.rect({w : props.canvas.w, h : 20, x : 0, y : 0, type : 'static'});
			socket.instance.b2d.rect({w : 20, h : props.canvas.h, x : 0, y : 0, type : 'static'});
			socket.instance.b2d.rect({w : 20, h : props.canvas.h, x : props.canvas.w - 20, y : 0, type : 'static'});
			socket.on('login', function () {
				totalSockets++;
				ticker.start();
				emitter.emit('createUser', socket);
			});
			socket.on('disconnect', function () {
				if(socket.user){
					io.in(socket.instance.id).emit('destroyPlayer', socket.user);
					emitter.emit('destroyPlayer', socket.user);
					totalSockets--;
				}
			});
		});
		characterManager.init();
		characterManager.initServer();
	});
}


module.exports = setupRequire;