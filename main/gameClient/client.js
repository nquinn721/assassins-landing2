define("gameClient/client", function () {
	return {
		setup : function (b2d) {
			this.b2d = b2d;
		},
		createUser : function (user) {
			this.user = user;
		}
	}
});