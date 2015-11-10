app.controller('home', ['$scope', '$http', function ($scope, $http) {

	$scope.searchUsers = function (search) {
		$scope.searchingUsers = true;
		$http.post('/search-users', {username : search}).then(function (acc) {
			if(acc.data.length){
				$scope.foundUsers = true;
				$scope.searchedUsers = acc.data;
			}else {
				$scope.foundUsers = false;
			}
		});
	}
	window.onbeforeunload = function(){}
}]);

