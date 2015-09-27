function setupRequire (requirejs, io, connection) {
	var cookie = require('cookie');

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
	function (require, ticker, body, emitter, instanceManager, gameManager, props, ping) {
		gameManager.init();
		ticker.start(io);
		ping.initServer();
		var spriteSheets = ['assassin', 'brute'],
			totalSockets = 0;

	
		io.on('connection', function (socket) {
			var user = cookie.parse(socket.handshake.headers.cookie).asc;

			
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
					cookie =  acc._id + rand

				
				acc.cookie = cookie;

				socket.account = acc;

				// socketAccounts[cookie] = rand;
				socket.emit('loggedIn', socket.account);
				totalSockets++;

			}

			socket.on('load', function (character) {
				if(socket.account){
					var instance = instanceManager.getInstance(); 
					var Class = require("game/character/classes/" + character);
					socket.account.characterClass = new Class;

					socket.instance = instance;

					socket.join(socket.instance.id);
					socket.instance.join(socket, io);

				}else{
					socket.emit('notLoggedIn');
				}
			});


			socket.on('keyup', function (keyCode) {
				if(socket.player){
					socket.player.keyUp(keyCode);
					socket.broadcast.to(socket.instance.id).emit('keyup',{player : socket.player.obj(), keyCode : keyCode});
				}
			});
			socket.on('keydown', function (keyCode) {
				if(socket.player){
					socket.player.keyDown(keyCode);
					socket.broadcast.to(socket.instance.id).emit('keydown',{player : socket.player.obj(), keyCode : keyCode});
				}
			});
			socket.on('mousedown', function (obj) {
				if(socket.player){
					socket.player.mouseDown(obj);
					socket.broadcast.to(socket.instance.id).emit('mousedown', {player : socket.player.obj(), obj : obj});
				}
			});

			socket.on('ping', function (obj) {
				emitter.emit('ping', obj);
			});

			socket.on('disconnect', function () {
				if(socket.user){
					io.in(socket.instance.id).emit('destroyPlayer', socket.user);
					socket.instance.leave(socket.user);
					emitter.emit('destroyPlayer', socket.user);
				}
			});
		});

	});
}


module.exports = setupRequire;