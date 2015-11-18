app.controller('home', ['$scope', '$http', 'io', '$document', 'session', function ($scope, $http, io, $document, session) {

	$document.on('click', function (e) {
		if($(e.target).parents('.search-users').length == 0 && $(e.target).parents('.found-users').length === 0){
			$scope.searchingUsers = false;
			$scope.searchUsername = '';
			$scope.$apply();
		}
	});
	window.onbeforeunload = function(){}
	$('[data-toggle="tooltip"]').tooltip();
	
}]);

