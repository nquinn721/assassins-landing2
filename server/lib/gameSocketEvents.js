module.exports =function (socket, io, instanceManager, emitter, require) {
	var IS_BLURRED = false;

	socket.on('start', function (character) {
		this.account = character.account;
		if(this.account){
			var instance = instanceManager.getInstance(); 
			var Class = require("game/character/classes/" + character.character.toLowerCase());
			this.account.characterClass = new Class;

			this.instance = instance;
			this.instance.join(this, io);

		}else{
			this.emit('notLoggedIn');
		}
	}).on('keyup', function (keyCode) {
		if(this.player && !IS_BLURRED){
			this.player.keyUp(keyCode);
			this.broadcast.to(this.instance.id).emit('keyup',{player : this.player.obj(), keyCode : keyCode});
		}
	}).on('keydown', function (keyCode) {
		if(this.player && !IS_BLURRED){
			this.player.keyDown(keyCode);
			this.broadcast.to(this.instance.id).emit('keydown',{player : this.player.obj(), keyCode : keyCode});
		}
	}).on('mousedown', function (obj) {
		if(this.player && !IS_BLURRED){
			this.player.mouseDown(obj);
			this.broadcast.to(this.instance.id).emit('mousedown', {player : this.player.obj(), mouse : obj});
		}
	}).on('ping', function (obj) {
		emitter.emit('ping', obj);
	}).on('blur', function () {
		IS_BLURRED = true;
		if(this.player)
			this.player.blur();
	}).on('focus', function () {
		IS_BLURRED = false;
		if(this.player)
			this.player.focus();
	}).on('disconnect', function () {
		if(this.user){
			io.in(this.instance.id).emit('destroyPlayer', this.user);
			this.instance.leave(this.user);
			emitter.emit('destroyPlayer', this.user);
		}
	});
};