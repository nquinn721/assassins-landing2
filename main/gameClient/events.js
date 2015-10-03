define("gameClient/events", [
		"require",
		"js/io",
		"core/emitter",
		"core/b2d",
		"gameClient/loader",
		"gameClient/client"
	], function (require, socket, emitter, B2D, Loader, client) {
	var DEBUG_DRAW = false,
		IS_BLURRED,
		gameStartCounter = 3000;
	function Events () {
		
	}
	Events.prototype = {
		on : {
			start : function (obj) {
				var self = this;
				emitter.on('gameSetup', function () {
					var loader = new Loader;
					require([
						"gameClient/canvas",
						"gameClient/background/background",
						"gameClient/viewport",
						"gameClient/stage/stage",
						"gameClient/screenTimer"
						], function (canvas, background, Viewport, stage, screenTimer) {
							screenTimer.show(3);
						stage.loadMap(obj.mapName, function (a) {
								setTimeout(function () {
									screenTimer.hide();
								}, gameStartCounter);

								var b2d = new B2D;
									b2d.init();
								canvas = canvas();
								loader.hide();


								if(DEBUG_DRAW)
									b2d.debugDraw(canvas.debugctx);
								
								background.init();

								client.setup(b2d);

								stage.ticker();
								
								emitter.emit('createUser', {b2d : b2d, user : obj.user});
								emitter.emit('createPlayers', {b2d : b2d, players : obj.players});
								emitter.emit('createMap', {map : obj.map, b2d : b2d});
								emitter.emit('doneloading');


								var viewport = new Viewport(client.user);
								viewport.init();
								
							setTimeout(function () {
								
								$(document).on('keydown', function (e) {
									if(IS_BLURRED)return;
									socket.emit('keydown', e.keyCode);
									client.user.keyDown(e.keyCode);
									emitter.emit('keydown', {player : client.user, keyCode : e.keyCode, shift : e.shiftKey});
								}).on('keyup', function (e) {
									if(IS_BLURRED)return;
									socket.emit('keyup', e.keyCode);
									client.user.keyUp(e.keyCode);
									emitter.emit('keyup', {player : client.user, keyCode : e.keyCode});
								})
								$(window).on('blur', function () {
									socket.emit('blur');
									emitter.emit('blur');
									IS_BLURRED = true;
								}).on('focus', function () {
									socket.emit('focus');
									emitter.emit('focus');
									IS_BLURRED = false;
								});
								$('.viewport').on('mousedown', function (e) {
									if(IS_BLURRED)return;
									var obj = {
										button : e.which, 
										x : e.offsetX, 
										y : e.offsetY
									}
									emitter.emit('mousedown', {player : client.user, mouse : obj});
									self.emit('mousedown', obj);
									return false;
								}).on('mouseup', function (e) {
									if(IS_BLURRED)return;
									// self.emit('mouseup', {button : e.which});
									// client.user.mouseUp();
									return false;
								}).on('contextmenu', function (e) {
									if(IS_BLURRED)return;
									// client.user.mouseDown();
									// self.emit('mousedown', {button : e.which, x : e.pageX, y : e.pageY});
									return false;
								});
							}, gameStartCounter);
							
						}.bind(this));
					})
				});
				emitter.emit('startGame');
				
			},
			hit : function () {
				emitter.emit('hit');
			},
			win : function () {
				emitter.emit('endGame');
				emitter.emit('win');
			},
			lose : function () {
				emitter.emit('endGame');
				emitter.emit('lose');
			},
			createPlayer : function (player) {
				emitter.emit('createPlayer', {b2d : cient.b2d, player : player});
			},
			destroyPlayer : function (player) {
				emitter.emit('destroyPlayer', player);
			},
			
			keydown : function (obj) {
				emitter.emit('keydown', obj);
			},
			keyup : function (obj) {
				emitter.emit('keyup', obj);
			},
			playerCoords : function (obj) {
				emitter.emit('playerCoords', obj);
			},
			mapCoords : function (obj) {
				emitter.emit('mapCoords', obj);
			},
			setHP : function (player) {
				emitter.emit('setHP', player);
			},
			mapItemsHP : function (items) {
				emitter.emit('mapItemsHP', items);
			},
			ping : function (ping) {
				emitter.emit('clientPing', {socket : socket, ping : ping});	
			},
			die : function (player) {
				emitter.emit('die', {player : player, b2d : client.b2d});
			}
		},
		endGame : function () {
			$(document).add('.viewport').off('click keydown keyup');
		}

	}
	var events = new Events;

	for(var i in events.on)
		socket.on(i, events.on[i]);
	socket.emit('startGame');

	emitter.on('endGame', events.endGame);
	return events;
});