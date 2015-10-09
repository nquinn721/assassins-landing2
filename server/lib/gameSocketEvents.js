module.exports =function (socket, io, emitter, require, db, port) {
	var IS_BLURRED = false,
		cookie = socket.request.cookies.al;
	

	// Get current user
	socket.on('getUser', function () {
		db.getSession(cookie, function (session) {
			socket.account = session.account;
			socket.emit('user', session.account);
			socket.broadcast.emit('newAccount', {username : session.account.username});
		});
	});

	// Get all accounts already in instance
	socket.on('getAccounts', function () {
		db.getInstance(port, function (accounts) {
			accounts = _.compact(accounts.map(function(v){if(v.cookie !== cookie)return { username : v.account.username, character : v.account.character}; }));
			socket.emit('accounts', accounts);
		});
	});



	socket.on('start', function (character) {
		if(this.account){
			var Class = require("game/character/classes/" + this.player.characterSelected);
			this.account.characterClass = new Class;
			// this.instance.start(this);
		}else{
			this.emit('notLoggedIn');
		}
	})
	.on('join', function (account) {
		// this.account = account;
		// var instance = instanceManager.getInstance(); 
		// this.instance = instance;
		// this.instance.join(this, io);
	})
	.on('characterSelected', function (char) {
			db.setCharacter(cookie, char, function () {
				socket.broadcast.emit('characterSelected', {id : socket.account.username, character : char});
			});
	})
	.on('keyup', function (keyCode) {
		if(this.player && !IS_BLURRED){
			this.player.keyUp(keyCode);
			this.broadcast.to(this.instance.id).emit('keyup',{player : this.player.obj(), keyCode : keyCode});
		}
	})
	.on('keydown', function (keyCode) {
		if(this.player && !IS_BLURRED){
			this.player.keyDown(keyCode);
			this.broadcast.to(this.instance.id).emit('keydown',{player : this.player.obj(), keyCode : keyCode});
		}
	})
	.on('mousedown', function (obj) {
		if(this.player && !IS_BLURRED){
			this.player.mouseDown(obj);
			this.broadcast.to(this.instance.id).emit('mousedown', {player : this.player.obj(), mouse : obj});
		}
	})
	.on('ping', function (obj) {
		emitter.emit('ping', obj);
	})
	.on('blur', function () {
		IS_BLURRED = true;
		if(this.player)
			this.player.blur();
	})
	.on('focus', function () {
		IS_BLURRED = false;
		if(this.player)
			this.player.focus();
	})
	.on('disconnect', function () {
		if(this.user){
			io.in(this.instance.id).emit('destroyPlayer', this.user);
			this.instance.leave(this.user);
			emitter.emit('destroyPlayer', this.user);
		}
	});
};