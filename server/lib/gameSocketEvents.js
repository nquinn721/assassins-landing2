module.exports =function (socket, io, emitter, require, db, port, gameManagerServer) {
	var IS_BLURRED = false,
		cookie = socket.request.cookies.al;
	

	// Get current user
	socket.on('getUser', function () {
		db.getSession(cookie, function (session) {
			session.account.character = session.character;
			session.account.team = session.team;
			session.account.socketId = socket.id;

			socket.join(session.account.team);
			gameManagerServer.join(socket.account);

			socket.account = session.account;
			
			socket.emit('user', session.account);
			socket.broadcast.to(session.account.team).emit('newAccount');
		});
	});

	// Get all accounts already in instance
	socket.on('getAccounts', function () {
		console.log('get accounts for team ', this.account.team);
		db.getTeam(cookie, port, this.account.team, function (accounts) {
			accounts = _.compact(accounts.map(function(v){return { username : v.account.username, character : v.character}; }));
			socket.emit('accounts', accounts);
		});
	});



	socket.on('start', function () {
		var Class = require("game/character/classes/" + this.account.character);
		this.account.characterClass = new Class;
		var player = playerManager.createPlayer({
				socketId : this.id, 
				username : this.account.username,
				team : this.account.team,
				base : this.account.team === 'team1' ? 'base0' : 'base1',
				categoryBits : this.account.team === 'team1' ? 0x1000 : 0x2000,
				maskBits : this.account.team === 'team1' ? 0x0100 | 0x0001 : 0x0200 | 0x0001
			});
		player.init(this.b2d, this.account.characterClass);
		
		socket.player = player;
		socket.player.account = {
			username : socket.account.username,
			id : socket.account._id
		}
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
			this.broadcast.to(this.instance.id).emit('keyup',{player : this.player.obj(), keyCode : keyCode});
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
			gameManagerServer.leave(this.account);
			io.emit('destroyPlayer', this.user);
			emitter.emit('destroyPlayer', this.user);
		}
	});
};