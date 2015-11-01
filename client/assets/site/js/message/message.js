app.factory('message', ['$rootScope', function ($rootScope) {
	
	return {
		show : function (msg, messageType) {
			$rootScope.showMessage = true;
			$rootScope.message = msg || 'Something went wrong';
			$rootScope.messageType = messageType === 0 ? 'ok' : messageType === 1 ? 'okcancel' : 'yesno';
		},
		hide : function () {
			$rootScope.showMessage = false;
		}
	}
}]);