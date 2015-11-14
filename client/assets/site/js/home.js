app.controller('home', ['$scope', '$http', 'io', '$document', function ($scope, $http, io, $document) {
	$scope.friends = [];

	$scope.searchUsers = function (search) {
		$scope.searchingUsers = true;
		$scope.showUsersFoundBox = true;
		$http.post('/search-users', {username : search}).then(function (acc) {
			if(acc.data.length){
				$scope.foundUsers = true;
				$scope.searchedUsers = acc.data;
			}else {
				$scope.foundUsers = false;
			}
		});
	}
	$scope.addUser = function (user) {
		$scope['removed-friend-' + user.id] = false;
		user.alreadyFriend = true;
		$http.post('/add-friend', {user : user.id}).then(function (user) {
			$scope.friends.push(user.data);
		});
	}
	$scope.removeFriend = function (user) {
		$scope['removed-friend-' + user] = true;
		$http.post('/remove-friend', {user : user});


		for(var i = 0; i < $scope.friends.length; i++)
			if($scope.friends[i].id === user)$scope.friends.splice(i,1);
	}
	$scope.isFriends = function (user) {
		return !$scope['removed-friend-' + user];
	}
	io.on('active', function (acc) {
		$scope['status' + acc.id] = 'active-important';
	});
	io.on('offline', function (acc) {
		$scope['status' + acc.id] = 'offline-important';
	});
	io.on('idle', function (acc) {
		$scope['status' + acc.id] = 'away-important';
	});

	$document.on('click', function (e) {
		if($(e.target).parents('.search-users').length == 0 && $(e.target).parents('.found-users').length === 0){
			$scope.searchingUsers = false;
			$scope.searchUsername = '';
			$scope.$apply();
		}
	});
	window.onbeforeunload = function(){}
}]);

