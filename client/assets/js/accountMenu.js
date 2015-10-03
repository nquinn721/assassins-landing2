define("js/accountMenu", ['js/app'], function (app) {
	app.controller('accountMenu', ['User', '$location', function (User, $location) {
		this.user = User;
		this.gotoCharacterSelect = function () {
			$location.path('/character-select');
		}
	}]);
});