define("gameClient/io", ['io'], function (io) {
	var socket = io.connect();
	return socket;
});