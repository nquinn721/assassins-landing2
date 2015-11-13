module.exports = function (socket, io, cookie, db) {

	socket.on('chat-msg', function (obj) {
		var user = obj.user,
			msg = obj.msg;

		io.sockets.connected[user].emit('chat-msg', obj.msg);
	});
}