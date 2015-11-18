app.directive('friends', ['$http', 'io', '$compile', '$rootScope', 'chatService', 'message', function ($http, io, $compile, $rootScope, chatService, message) {
	return {
		restrict : 'E',
		link : function ($scope, $el, $attrs) {
			var user = $attrs.user;
			$scope.friends = [];
			$scope.chat = chatService;


			$scope.addFriend = function (user) {
				$scope['removed-friend-' + user.id] = false;
				user.alreadyFriend = true;
				$http.post('/add-friend', {user : user.id}).then(function (user) {
					$scope.friends.push(user.data);
				});
			};
			$scope.removeFriend = function (user, username) {
				message.confirm("Are you sure you want to unfriend <b>" + username + "</b>?", function () {
					$scope['removed-friend-' + user] = true;
					$http.post('/remove-friend', {user : user});


					for(var i = 0; i < $scope.friends.length; i++)
						if($scope.friends[i].id === user)$scope.friends.splice(i,1);
				});
			};
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
			};
			$scope.isFriends = function (user, alreadyUser) {
				var found;

				if(alreadyUser){
					for(var i = 0; i < $scope.friends.length; i++)
						if($scope.friends[i].id === user)found = true;

					if(found)
						return false;
				}

				return !$scope['removed-friend-' + user];
			};
			

			io.on('active', function (acc) {
				$scope['status' + acc.id] = 'active-important';
			});
			io.on('offline', function (acc) {
				$scope['status' + acc.id] = 'offline-important';
			});
			io.on('idle', function (acc) {
				$scope['status' + acc.id] = 'away-important';
			});
			

			$('.add-friend').on('click', function () {
				$('.search-users input').focus();
			});
		},
		templateUrl : '/friends-list'
	}
}])