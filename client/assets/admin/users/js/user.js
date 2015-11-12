ADMIN.controller('manageUser', ['$scope', '$http', '$document', 'socket', function ($scope, $http, $document, socket) {
	$http.get('/all-users').then(function (users) {
		$scope.users = users.data;
	});
	$scope.deleteUser = function (id) {
		$http.post('/delete-user', {user : id});
		$scope['user' + id] = true;
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

}]);