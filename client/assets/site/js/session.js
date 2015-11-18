app.service('session', ['$http', function ($http) {
	var session;
	$http.get('/get-session').then(function (data) {
		session = data.data;
	});
	return {
		get : function () {
			return session;
		}
	}
}]);