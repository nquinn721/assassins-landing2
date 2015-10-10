app.controller('game', ['$http','$scope','$sce', '$rootScope', function ($http, $scope, $sce, $rootScope) {
	$rootScope.showLoader = true;
  	$scope.html = function(val) {
        return $sce.trustAsHtml(val);
    };

	$http.get('/an-start-game').then(function (game) {
		$scope.gameFrame = game.data;
		$rootScope.showLoader = false;
	});
}]);