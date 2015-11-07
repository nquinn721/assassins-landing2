app.controller('game', ['$http','$scope','$sce', '$rootScope', '$location', '$timeout', 'message','io',
	function ($http, $scope, $sce, $rootScope, $location, $timeout, message, io) {
	$rootScope.showLoader = true;
	$scope.gameLoaded = false;
  	$scope.html = function(val) {
        return $sce.trustAsHtml(val);
    };
    console.log(window.location.hash.split('=')[1]);
	$http.get('/an-start-game?players=' + window.location.hash.split('=')[1]).then(function (game) {
		if(game.data == 'noinstance'){
			$rootScope.noInstance = true;
			$rootScope.showLoader = false;
			$scope.gameLoaded = false;
			$location.path('/');
			return;
		}

		socket.emit('join', parseInt(game.data.match(/src="http:\/\/localhost:([0-9]+)"/)[1]));
		$scope.gameLoaded = true;
		$scope.gameFrame = game.data;
		$rootScope.showLoader = false;
		$timeout(function () {
			$(document).on('click', function () {
				$('iframe')[0].contentWindow.focus();
			});
			$('iframe')[0].contentWindow.focus();
		}, 3000)
	});
	io.on('end', function () {
		$location.path('/game-stats');
	})
	window.onbeforeunload = function () {
		// message.show("You are in a game instance are you sure you want to leave the page?", 2);
		// $scope.$digest();
		// $('.message').show();
		return "You are in a game instance are you sure you want to leave the page?";
	};

}]);