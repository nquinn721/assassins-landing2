define("js/events", ["require", "js/app", "core/emitter"], function (require, app, emitter) {
	app.factory('events', ['socket', '$location', '$rootScope', function (socket, $location, $rootScope) {
		socket.on('startGame', function () {
			// $location.path('/viewport');
			require(['gameClient/gameManagerClient'], function (obj) {
				obj.startEvents();
				obj.init();
				
			});
		});

		socket.on('win', function () {
			setTimeout(function () {
				location('/game-stats');
			}, 3000);
		});
		socket.on('lose', function () {
			setTimeout(function () {
				location('/game-stats');
			}, 3000);
		});
		emitter.on('startGame', function () {
			setTimeout(function () {
				location('/viewport');
			}, 2000);
		});
		function location (loc) {
			$rootScope.$apply(function () {
				$location.path(loc);
			});
		}
		return {};
	}]);
});