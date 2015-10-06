define("js/home", ["js/app"], function (app) {
	app.controller("home", ["User", "socket", function (User, socket) {
		this.user = User;

		this.play = function () {
			socket.emit('join', this.user);
		}

	}]);
});