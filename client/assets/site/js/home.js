app.controller('home', ["message", "$timeout", "$window", '$scope', function (message, $timeout, $window, $scope) {

	// message.show("You are in a game instance are you sure you want to leave the page?", 2);
	window.onbeforeunload = function(){}
}]);

