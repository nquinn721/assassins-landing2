
require([
	'js/canvas',
	'core/b2d',
	'core/shapes',
	'js/createjs',
	'game/character/characterManager',
	'core/emitter',
	'core/props'
	], 
	function (canvas, b2d, shapes, createjs, characterManager, emitter, props) {
		var socket = io.connect();

		characterManager.init();
		characterManager.initClient();


		socket.emit('login');

			// Delete when instances are setup
		var b2d = new b2d;

		b2d.debugDraw(canvas.debugctx);
		b2d.rect({w : props.canvas.w, h : 20, x : 0, y : props.canvas.h - 20, type : 'static'});
		b2d.rect({w : props.canvas.w, h : 20, x : 0, y : 0, type : 'static'});
		b2d.rect({w : 20, h : props.canvas.h, x : 0, y : 0, type : 'static'});
		b2d.rect({w : 20, h : props.canvas.h, x : props.canvas.w - 20, y : 0, type : 'static'});

		socket.on('createUser', function(player){
			createjs.ticker();
			emitter.emit('createUser', {player : player, b2d : b2d});
		});
		socket.on('createPlayer', function (player) {
			emitter.emit('createPlayer', {player : player, b2d : b2d});
		})

		socket.on('destroyPlayer', function (player) {
			console.log('destroyPlayer', player.id);
			emitter.emit('destroyPlayer', player);
		});


});


