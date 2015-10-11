app.controller('game', ['$http','$scope','$sce', '$rootScope', '$location', function ($http, $scope, $sce, $rootScope, $location) {
	$rootScope.showLoader = true;
	$scope.gameLoaded = false;
  	$scope.html = function(val) {
        return $sce.trustAsHtml(val);
    };
	$http.get('/an-start-game').then(function (game) {
		console.log(game.data);
		if(game.data == 'noinstance'){
			$rootScope.noInstance = true;
			$rootScope.showLoader = false;
			$scope.gameLoaded = false;
			$location.path('/');
			return;
		}

		$scope.gameLoaded = true;
		$scope.gameFrame = game.data;
		$rootScope.showLoader = false;
		setTimeout(function () {
			$(document).on('click', function () {
				$('iframe')[0].contentWindow.focus();
			});
			$('iframe')[0].contentWindow.focus();
		}, 3000)
	});


}]);