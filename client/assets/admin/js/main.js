var admin = angular.module('admin', []);

admin.controller('manageUser', ['$scope', '$http', '$document', function ($scope, $http, $document) {
	$http.get('/all-users').then(function (users) {
		$scope.users = users.data;
	});
	$scope.deleteUser = function (id) {
		$http.post('/delete-user', {user : id});
		$scope['user' + id] = true;
	}

	$scope.addUser = function () {
		$http.post('/create-user', {username : $scope.username, password : $scope.password}).then(function (user) {
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

admin.directive('focusMe', function($timeout, $parse) {
  return {
    //scope: true,   // optionally create a child scope
    link: function(scope, element, attrs) {
      var model = $parse(attrs.focusMe);
      scope.$watch(model, function(value) {
        if(value === true) { 
          $timeout(function() {
            element[0].focus(); 
          });
        }
      });
      // to address @blesh's comment, set attribute value to 'false'
      // on blur event:
      element.bind('blur', function() {
         scope.$apply(model.assign(scope, false));
      });
    }
  };
});