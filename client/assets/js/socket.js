define("js/socket", [
	"core/emitter", 
	"core/b2d", 
	'js/io', 
	'js/canvas',
	'js/createjs',
	'js/menu',
	'js/viewport',
	'core/props',
	'core/wallsAndFloors'
	], function (emitter, B2D, io, canvas, createjs, menu, Viewport, props, wallsAndFloors) {

		
	
		function Socket(){

		}
		Socket.prototype = {
			init : function () {
				this.setup.call(io);

				this.events();
			},
			events : function () {
				emitter.on('login', this.login.bind(this));
				emitter.on('start', this.startGame.bind(this));	
			},
			setup : function () {
				this.b2d = new B2D;
				this.b2d.init();
				this.b2d.debugDraw(canvas.debugctx);

				// for(var i = 0; i < wallsAndFloors.length; i++)
				// 	this.b2d.rect(wallsAndFloors[i]);
				
			},
			startGame : function () {
				menu.showGame();
				this.emit('start');	
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
			},
			failedLogin : function () {
				menu.showFailedLogin();
			},
			notLoggedIn : function () {
				menu.showLogin();
			},

			createUser : function(obj){
				createjs.ticker();
				this.player = obj.user;
				emitter.emit('createUser', this);


			},
			map : function (map) {
				var viewport = new Viewport(this.player);
				viewport.init();	

				this.map = map;
				emitter.emit('createMap', this);
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
			coords : function (obj) {
				emitter.emit('mapCoords', obj.mapItems);
			},
			ping : function (ping) {
				emitter.emit('clientPing', {socket : this, ping : ping});	
			},

			start : function () {
				var self = this;



				$(document).on('keydown', function (e) {
					self.emit('keydown', e.keyCode);
					self.player.keyDown(e.keyCode);
				});

				$(document).on('keyup', function (e) {
					self.emit('keyup', e.keyCode);
					self.player.keyUp(e.keyCode);
				});
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