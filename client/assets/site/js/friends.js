app.directive('friends', ['$http', 'io', '$compile', '$rootScope', 'chatService', 'message', function ($http, io, $compile, $rootScope, chatService, message) {
	return {
		restrict : 'E',
		link : function ($scope, $el, $attrs) {
			var user = $attrs.user;
			$scope.friends = [];
			$scope.chat = chatService;


			$scope.online = function(user) {
				if(user)
				   return user.status === 'active' ? -1 : user.status === 'away' ? 0 : 1;
			};
			$scope.addFriend = function (user) {
				id = user.id || user;

				if(typeof user === 'object') 
					user.alreadyFriend = true;

				$scope['removed-friend-' + id] = false;

				$http.post('/add-friend', {user : id}).then(function (user) {
					var found;
					for(var i = 0; i < $scope.friends.length; i++){
						console.log($scope.friends[i]._id, user.data._id);
						if($scope.friends[i]._id == user.data.id)found = true;
					}

					if(!found)$scope.friends.push(user.data);
					console.log($scope.friends);
				});
			};
			$scope.removeFriend = function (user, username) {
				message.confirm("Are you sure you want to unfriend <b>" + username + "</b>?", function () {
					$scope['removed-friend-' + user] = true;
					$http.post('/remove-friend', {user : user});


					for(var i = 0; i < $scope.friends.length; i++)
						if($scope.friends[i].id === user)$scope.friends.splice(i,1);
					$rootScope.$broadcast('removeFriend', user);
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
			$http.get('/get-friends-list').then(function (friends) {
				$scope.friends = friends.data;
			});
			$scope.$on('addFriend', function (e, data) {
				console.log('add friend', data);
				$scope.addFriend(data);
			});
		},
		templateUrl : '/friends-list'
	}
}]);
