define("js/matchMaking", ["js/app"], function (app) {
	app.controller('matchMaking', ['$scope', 'characters', function ($scope, characters) {
		var self = this;
		characters.get(function (ch) {
			self.characters = ch;
		});
	}]);
})