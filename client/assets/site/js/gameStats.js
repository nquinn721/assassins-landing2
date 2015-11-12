app.controller('gameStats', ['$http', '$scope', function ($http, $scope) {
	$http.get('/game-stats').then(function (session) {
		var data = session.data;
		$scope.kills = data.kills;
		$scope.deaths = data.deaths;
		$scope.killedBy = data.killedBy;
		$scope.killed = data.killed;
	});
	window.onbeforeunload = function(){}
}]);