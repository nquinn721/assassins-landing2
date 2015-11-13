ADMIN.controller('manageSessions', ['$scope', '$http', '$document', 'adminSocket', function ($scope, $http, $document, adminSocket) {
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


	adminSocket.on('newSession', function (session) {
		session.pretty = JSON.stringify(session, null, 2)
		$scope.sessions.push(session);
	});
	adminSocket.on('destroySession', function (session) {
		$scope.sessions.splice($scope.sessions.indexOf(session), 1);
	});
	adminSocket.on('joined', function (obj) {
		var session = getSession('cookie', obj.cookie);
		session.instance = obj.port;
	});
	adminSocket.on('leftInstance', function (obj) {
		var session = getSession('cookie', obj.cookie);
		session.instance = undefined;
	});

	function getSession (key, value) {
		for(var i = 0; i < $scope.sessions.length; i++)
			if($scope.sessions[i][key] === value)return $scope.sessions[i];
	}

}]);