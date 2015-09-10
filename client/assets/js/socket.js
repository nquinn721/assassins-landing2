define("js/socket", [
	"core/emitter", 
	"core/b2d", 
	'js/io', 
	'js/canvas',
	'js/createjs',
	'js/menu'
	], function (emitter, b2d, io, canvas, createjs, menu) {

	var b2d = new b2d;
	b2d.init();
	b2d.debugDraw(canvas.debugctx);

	io.user = {
		b2d : b2d
	};
	var events = {
		init : function () {
			this.events();	
		},
		events : function () {
			emitter.on('login', this.login.bind(this));
			emitter.on('start', this.startGame.bind(this));	
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
			this.user.account = acc;
			menu.setAccountInfo(acc);
			// if(acc.cookie)
			// 	document.cookie = 'asc=' + acc.cookie;
			menu.showAccount();
		},
		failedLogin : function () {
			menu.showFailedLogin();
		},
		notLoggedIn : function () {
			// menu.showError('Not logged in!');
			menu.showLogin();
		},

		createUser : function(obj){
			createjs.ticker();
			this.user.player = obj.player;
			this.user.account = obj.account;
			emitter.emit('createUser', this.user);
		},
		map : function (map) {
			emitter.emit('createMap', {b2d : b2d, map : map, user : this.user.player});
		},
		createPlayer : function (player) {
			emitter.emit('createPlayer', {player : player, b2d : b2d});
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

		start : function () {
			var self = this;



			$(document).on('keydown', function (e) {
				self.emit('keydown', e.keyCode);
				self.user.player.keyDown(e.keyCode);
			});

			$(document).on('keyup', function (e) {
				self.emit('keyup', e.keyCode);
				self.user.player.keyUp(e.keyCode);
			});
		},
		emit : function (event, data) {
			io.emit(event, data);
		}
	}
	events.init();
	for(var i in events)
		io.on(i, events[i]);
	return events;
})