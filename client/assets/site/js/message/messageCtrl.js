app.controller('messageCtrl', ['message', function (message) {
	this.hideMessage = function () {
		message.hide();
	}
	this.confirmMessage = function () {
		message.confirmMessage();
	}
}]);