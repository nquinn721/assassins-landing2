function setupRequire (requirejs, io) {
	var totalSockets = 0;
	var cookie = require('cookie');
	requirejs([
		'core/ticker',
		'core/body',
		'core/emitter',
		'game/instance/instanceManager',
		'game/gameManager',
		'core/props',
		'game/db/connection',

	],
	function (ticker, body, emitter, instanceManager, gameManager, props, connection) {
		var instance = instanceManager.createInstance(); 
		ticker.start(io);
	
		connection.init();

		io.on('connection', function (socket) {
			var user = cookie.parse(socket.handshake.headers.cookie).asc;

			if(totalSockets % 2 === 0 && totalSockets !== 0){
				instance = instanceManager.createInstance();
			}
			socket.instance = instance;
			socket.join(socket.instance.id);

			// if(typeof socketAccounts[user] !== 'undefined'){
			if(user){
				connection.loginId(user.replace(socketAccounts[user], ''), login);
			}else{
				socket.emit('notLoggedIn');
			}

			socket.on('login', function (obj) {
				connection.login(obj.username, obj.password, login, function () {
					socket.emit('failedLogin');
				});
			});
			function login (acc) {
				var rand = '',//Math.random(),
					cookie =  acc._id + rand;
				
				acc.cookie = cookie;

				socket.account = acc;
				// socketAccounts[cookie] = rand;
				totalSockets++;
				socket.emit('loggedIn', acc);

			}

			socket.on('start', function () {
				if(socket.account){
					emitter.emit('createUser', socket);
					emitter.emit('createMap', socket);
				}else{
					socket.emit('notLoggedIn');
				}
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