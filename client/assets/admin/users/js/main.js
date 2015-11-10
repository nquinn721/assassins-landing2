ADMIN.controller('manageUser', ['$scope', '$http', '$document', 'socket', function ($scope, $http, $document, socket) {
	$http.get('/all-users').then(function (users) {
		$scope.users = users.data.users;
		$scope.sessions = users.data.sessions;
	});
	$scope.deleteUser = function (id) {
		$http.post('/delete-user', {user : id});
		$scope['user' + id] = true;
	}
	$scope.deleteSession = function (id) {
		$http.post('/delete-session', {session : id});
		$scope['session' + id] = true;
	}

	$scope.addUser = function () {
		$http.post('/create-user', {
			username : $scope.username,
			password : $scope.password,
			email : $scope.email,
			firstName : $scope.firstName,
			lastName : $scope.lastName,
			
		}).then(function (user) {
			$scope.users.push(user.data);
			$scope.showUserForm = false;
			$scope.username = '';
			$scope.password = '';
		});
	}

	$scope.toggleAdmin = function (id, admin) {
		$http.post('/update-user', {_id : id, admin : !admin}).then(function () {
			
		})
	}

	socket.on('newSession', function (session) {
		$scope.sessions.push(session);
	});
	socket.on('destroySession', function (session) {
		console.log('destroy', session);
		$scope.sessions.splice($scope.sessions.indexOf(session), 1);
	});

}]);