define('js/auth', ['js/app'], function (app) {
	app.factory('Auth', ['$http', 'User', function ($http, User) {
		return {
			loggedIn : false,
			isLoggedIn : function () {
				return this.loggedIn;
			},
			login : function (username, password, cb) {
				var self = this;
				$http.post('/login', {username : username, password : password}).then(function (user) {
					if(user.data === 'failedLogin')
						cb(false);
					else{
						User.setUser(user.data);
						self.loggedIn = true;
						cb(true);
					}
				});
			}
		}
	}])
});