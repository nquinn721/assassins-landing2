module.exports =function (socket, io, emitter, require, db, port, gameManagerServer) {
	var IS_BLURRED = false,
		cookie = socket.request.cookies.al;
	

	// Get current user
	socket.on('getUser', function () {
		db.getSession(cookie, function (session) {
			session.account.character = session.character;
			session.account.team = session.team;
			session.account.socketId = socket.id;
			session.account.started = session.started;
			session.account.socketId = this.id;

			socket.join(session.account.team);
			gameManagerServer.join(socket.account);

			socket.account = session.account;
			
			socket.emit('user', session.account);
			socket.broadcast.to(session.account.team).emit('newAccount');
			
		});
	})
	.on('getAccounts', function () {
		db.getTeam(cookie, port, this.account.team, function (accounts) {
			accounts = _.compact(accounts.map(function(v){return { username : v.account.username, character : v.character}; }));
			socket.emit('accounts', accounts);
			if(socket.account.started && socket.account.started !== 'false')
				socket.emit('gotoMatchMaking');
			else socket.emit('stayInCharacterSelect');
		});
	})
	.on('start', function () {
		gameManagerServer.start(this);
	})
	.on('characterSelected', function (char) {
		this.account.character = char;
		db.setCharacter(cookie, char, function () {
			socket.broadcast.to(socket.account.team).emit('characterSelected', {id : socket.account.username, character : char});
		});
	})
	.on('keyup', function (keyCode) {
		if(this.player && !IS_BLURRED){
			this.player.keyUp(keyCode);
			this.broadcast.emit('keyup',{player : this.player.obj(), keyCode : keyCode});
		}
	})
	.on('keydown', function (keyCode) {
		if(this.player && !IS_BLURRED){
			this.player.keyDown(keyCode);
			this.broadcast.emit('keydown',{player : this.player.obj(), keyCode : keyCode});
		}
	})
	.on('mousedown', function (obj) {
		if(this.player && !IS_BLURRED){
			this.player.mouseDown(obj);
			this.broadcast.emit('mousedown', {player : this.player.obj(), mouse : obj});
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
		if(this.account){
			gameManagerServer.leave(this.player);
			// io.emit('destroyPlayer', this.user);
			// emitter.emit('destroyPlayer', this.user);
		}
	});
};