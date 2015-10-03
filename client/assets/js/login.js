define("js/login", ['js/app'], function (app) {
	app.controller('login', ["$scope", "$http", "$location", "account", "Auth",
		function ($scope, $http, $location, account, Auth) {
		this.username = "";
		this.password = "";

		this.submit = function () {
			var self = this;
			Auth.login(this.username, this.password, function (loggedIn) {
				if(!loggedIn){
					failedLogin = true;
					$location.path('/');
				}else {
					$location.path('/character-select');
				}
			})
			
		}
	}]);
});