
require([
	'js/canvas',
	'core/b2d',
	'core/shapes',
	'js/createjs',
	'game/gameManager',
	'core/emitter',
	'core/props'
	], 
	function (canvas, b2d, shapes, createjs, gameManager, emitter, props) {
		var socket = io.connect();

		gameManager.init();
		gameManager.initClient();


		socket.emit('login');

			// Delete when instances are setup
		var b2d = new b2d;

		b2d.debugDraw(canvas.debugctx);

		socket.user = {
			b2d : b2d
		}

		socket.on('createUser', function(player){
			createjs.ticker();
			socket.user.player = player;
			emitter.emit('createUser', socket.user);
		});
		socket.on('map', function (map) {
			emitter.emit('createMap', {b2d : b2d, map : map, user : socket.user.player});
		});
		socket.on('createPlayer', function (player) {
			emitter.emit('createPlayer', {player : player, b2d : b2d});
		});

		socket.on('destroyPlayer', function (player) {
			emitter.emit('destroyPlayer', player);
		});
		
		socket.on('keydown', function (obj) {
			emitter.emit('keydown', obj);
		});
		socket.on('keyup', function (obj) {
			emitter.emit('keyup', obj);
		});

		$(document).on('keydown', function (e) {
			socket.emit('keydown', e.keyCode);
			socket.user.player.keyDown(e.keyCode);
		});

		$(document).on('keyup', function (e) {
			socket.emit('keyup', e.keyCode);
			socket.user.player.keyUp(e.keyCode);
		})


});


