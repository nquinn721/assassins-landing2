define('js/user', ['js/app'], function (app) {
	app.factory('User', function () {
		return {
			username : undefined,
			setUser : function (user) {
				for(var i in user)
					this[i] = user[i];
			},
			upper : function () {
				return this.username.substr(0,1).toUpperCase() + this.username.substr(1);
			},
			fullName : function () {
				return this.firstName + ' ' + this.lastName;
			}
		}
	})
})