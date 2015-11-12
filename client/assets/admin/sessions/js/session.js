ADMIN.controller('manageSessions', ['$scope', '$http', '$document', 'socket', function ($scope, $http, $document, socket) {
	$http.get('/all-sessions').then(function (sessions) {
		sessions.data.forEach(function (v) {
			v.pretty = JSON.stringify(v, null, 2);
		});
		$scope.sessions = sessions.data;
	});
	
	$scope.deleteSession = function (id) {
		$http.post('/delete-session', {session : id});
		$scope['session' + id] = true;
	}


	socket.on('newSession', function (session) {
		session.pretty = JSON.stringify(session, null, 2)
		$scope.sessions.push(session);
	});
	socket.on('destroySession', function (session) {
		$scope.sessions.splice($scope.sessions.indexOf(session), 1);
	});
	socket.on('joined', function (obj) {
		var session = getSession('cookie', obj.cookie);
		session.instance = obj.port;
	});
	socket.on('leftInstance', function (obj) {
		var session = getSession('cookie', obj.cookie);
		session.instance = undefined;
	});

	function getSession (key, value) {
		for(var i = 0; i < $scope.sessions.length; i++)
			if($scope.sessions[i][key] === value)return $scope.sessions[i];
	}

}]);