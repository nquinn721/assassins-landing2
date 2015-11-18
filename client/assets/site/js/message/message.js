app.factory('message', ['$rootScope', '$sce', function ($rootScope, $sce) {
	
	return {
		confirm : function (msg, cb, messageType) {
			this.show(msg, messageType || 1);	
			this.cb = cb;
		},
		show : function (msg, messageType) {
			$rootScope.showHideMessageSplash = 'fadeIn';
			$rootScope.showHideMessageBox = 'bounceInDown';
			$rootScope.showMessage = true;
			$rootScope.message = $sce.trustAsHtml(msg) || 'Something went wrong';
			$rootScope.messageType = messageType === 0 ? 'ok' : messageType === 1 ? 'okcancel' : 'yesno';
		},
		hide : function () {
			$rootScope.showHideMessageSplash = 'fadeOut';
			$rootScope.showHideMessageBox = 'bounceOutUp';
			setTimeout(function () {
				$rootScope.showMessage = false;
				$rootScope.$apply();
			}, 500);
		},
		confirmMessage : function () {
			this.cb();
			this.hide();
		}
	}
}]);