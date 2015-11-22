app.directive('chat', ['$http', 'io', '$rootScope', 'session', function ($http, io, $rootScope, session) {
	return {
		restrict : 'E',
		replace : true,
		scope : {},
		link : function ($scope, $el, $attrs) {
			var room = $attrs.room,
				chatUser = $attrs.user,
				chatUserId = $attrs.userid,
				firstMessage = $attrs.msg,
				receiving = $attrs.receiving,
				messagesSent = 0,
				focused = true,
				storage = [],
				room;

			$scope.chatUser = $attrs.user;
			$scope.chatUserId = chatUserId;
			$scope.status = $attrs.status;
			$scope.messages = [];
			$scope.isFriend = $attrs.isfriend === 'no' ? true : false;


			if(firstMessage && firstMessage.indexOf('{') > -1){
				firstMessage = JSON.parse(firstMessage);
				for(var i in firstMessage)createMessage(firstMessage[i].msg, firstMessage[i].time, chatUser);
			}else if(firstMessage)
				createMessage(firstMessage, Date.now(), chatUser);
			// if(localStorage[room])
			// 	$scope.messages = JSON.parse(localStorage[room]);
			


			$el.css('right', (($attrs.totalChats - 1) * 230) + 10)
			   .find('input').focus();

			$scope.minimizeChat = function () {
				if(!$scope.minimized){
					$scope.minimized = true;
					$el.animate({bottom : '-228'});
				}else{
					$scope.minimized = false;
					$el.animate({bottom : 0});
				}
			}

			$scope.sendMessage = function () {
				var obj = createMessage($scope.msg, Date.now());
				messagesSent++;
				console.log('send message');
				$http.post('/send-message', {
					room : room,
					user : chatUserId,
					msg : $scope.msg,
					time : Date.now()
				});
				$scope.msg = '';
			}
			io.on('message-' + room, function (obj) {
				console.log('create message');
				createMessage(obj.msg, obj.time, obj.user);
			});
			io.on('message-' + '/chat-' + (room.split('-').slice(1).reverse().join('-')), function (obj) {
				console.log('create message');
				createMessage(obj.msg, obj.time, obj.user);
			})

			function createMessage (msg, time, username) {
				var obj = {
					user : username || 'You', 
					msg : msg, 
					dir : username ? 'left' : 'right', 
					time : time || Date.now()
				};

				$scope.messages.push(obj);
				storage.push(obj);
				localStorage[room] = JSON.stringify(storage);


				setTimeout(function () {
					$el.find('.chat-body').scrollTop($el.find('.msg-body').height());
				}, 1);
				return obj;
			}

			$scope.addFriend = function (friend) {
				$rootScope.$broadcast('addFriend', friend);
				$scope.isFriend = false;
			}

			$scope.destroy = function () {
				$scope.$destroy();
			}

			$scope.$on('$destroy', function () {
				$rootScope.$broadcast('destroyed-chat-' + room);
				$el.remove();
			});
			$scope.$on('removeFriend', function (friend) {
				$scope.isFriend = true;
			});

			io.on('active', function (acc) {
				$scope['status' + acc.id] = 'active-important';
			});
			io.on('offline', function (acc) {
				$scope['status' + acc.id] = 'offline-important';
			});
			io.on('idle', function (acc) {
				$scope['status' + acc.id] = 'away-important';
			});

		},
		templateUrl : '/chat-box'
	}
}]);