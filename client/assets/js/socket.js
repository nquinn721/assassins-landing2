define("js/socket", [
	'core/emitter', 
	'core/b2d', 
	'js/io', 
	'js/canvas',
	'js/createjs',
	'js/menu',
	'js/viewport',
	'core/props',
	'js/accountMenu',
	'gameClient/background/background',
	'js/matchMaking'
	], function (emitter, B2D, io, canvas, createjs, menu, Viewport, props, AccountMenu, background, matchMaking) {

		var DEBUG_DRAW = false;


		var accountMenu = new AccountMenu(this.account);
		accountMenu.init();
	
		function Socket(){

		}
		Socket.prototype = {
			init : function () {
				this.setup.call(io);

				this.events();
			},
			events : function () {
				emitter.on('login', this.login.bind(this));
				emitter.on('start', this.loadGame.bind(this));	
			},
			setup : function () {
				this.b2d = new B2D;
				this.b2d.init();

				if(DEBUG_DRAW)
					this.b2d.debugDraw(canvas.debugctx);

				
			},
			loadGame : function () {
				this.emit('load', accountMenu.character);	
			},
			login : function (obj) {
				this.emit('login', {
					username : obj.username, 
					password : obj.password
				});	
			},
			loggedIn : function (acc) {
				this.account = acc;
				menu.setAccountInfo(acc);
				
				// if(acc.cookie)
				// 	document.cookie = 'asc=' + acc.cookie;
					menu.showAccount();	
				// menu.showAccount();
			},
			failedLogin : function () {
				menu.showFailedLogin();
			},
			notLoggedIn : function () {
				menu.showLogin();
			},
			matchMaking : function (obj) {
				menu.showMatchMaking();
				matchMaking.showPlayers(obj);
			},
			hit : function () {
				emitter.emit('hit');
			},
			createUser : function(obj){
				emitter.emit('createUser', this);
			},
			createPlayer : function (player) {
				emitter.emit('createPlayer', {b2d : this.b2d, player : player});
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
				emitter.emit('clientPing', {socket : this, ping : ping});	
			},
			start : function (obj) {
				var self = this;

				setTimeout(function () {
					menu.showLoader();
					createjs.loadMap(obj.mapName, function (a) {

						/**
						 * This setTimeout is for loading screen only
						 */
						setTimeout(function () {

							
							menu.showGame();

							background.init();

							this.player = obj.user;

							createjs.ticker();
							
							emitter.emit('createUser', this);
							emitter.emit('createPlayers', {b2d : this.b2d, players : obj.players});
							emitter.emit('createMap', {map : obj.map, b2d : this.b2d});
							emitter.emit('doneloading');


							var viewport = new Viewport(this.player);
							viewport.init();

							$(document).on('keydown', function (e) {
								self.emit('keydown', e.keyCode);
								self.player.keyDown(e.keyCode);
								emitter.emit('keydown', {player : self.player, keyCode : e.keyCode, shift : e.shiftKey});
							}).on('keyup', function (e) {
								self.emit('keyup', e.keyCode);
								self.player.keyUp(e.keyCode);
								emitter.emit('keyup', {player : self.player, keyCode : e.keyCode});
							})
							$('.menu').css('pointer-events', 'none');
							$('.viewport').on('mousedown', function (e) {
								var obj = {
									button : e.which, 
									x : e.offsetX, 
									y : e.offsetY
								}
								// self.player.mouseDown(obj);
								emitter.emit('mousedown', {player : self.player, mouse : obj});
								self.emit('mousedown', obj);
								return false;
							}).on('mouseup', function (e) {
								// self.emit('mouseup', {button : e.which});
								// self.player.mouseUp();
								return false;
							}).on('contextmenu', function (e) {
								// self.player.mouseDown();
								// self.emit('mousedown', {button : e.which, x : e.pageX, y : e.pageY});
								return false;
							});
						}.bind(this), 1000);
						
					}.bind(this));
				}.bind(this), 1000)

			},
			die : function (player) {
				emitter.emit('die', {player : player, b2d : this.b2d});
			},
			mousedown : function (obj) {
				emitter.emit('mousedown', obj);	
			},
			emit : function (event, data) {
				io.emit(event, data);
			},
			createElement : function (obj) {
				emitter.emit('createElement', {b2d: this.b2d, obj : obj});	
			},
			destroyElement : function (id) {
				emitter.emit('destroyElement', id);
			},
			disconnect : function () {

			}
		}
	var socket = new Socket;
	socket.init(io);
	for(var i in socket)
		io.on(i, socket[i]);
	return socket;
})