define("game/js/matchMaking", [
	"gameClient/gameManagerClient"
	], function (gameManagerClient) {
	gameManagerClient.init();
	gameManagerClient.startEvents();
	return ['socket','$scope', '$location', '$timeout', '$interval', function (socket, $scope, $location, $timeout, $interval) {
		var timer;

		this.playersWaiting = [];
		this.loadingTime = 1200;
		this.loadingWidth = 0;
		this.time = 0;
		this.title = "Waiting for players...";
		

		this.matchMaking = function (players) {
			this.playersWaiting = players;
		};
		this.showLoader = function () {
			this.loading = true;	
		};
		this.startGame = function () {
			var self = this;
			this.loadingGame = true;
			this.title = "Loading Game!";
			$timeout(function () {
				self.timer = $interval(function () {
					var num = (Math.round(self.time / self.loadingTime * 100));
					self.loadingWidth =  num + '%';
					self.time++;
					if(num >= 100)
						$interval.cancel(self.timer);
				}, 1);
			}, 1000);
		};
		this.showViewport = function () {
			$location.path('/viewport');
		}
		socket.emit('start');
		socket.on('matchMaking', this.matchMaking.bind(this));
		socket.on('showLoader', this.showLoader.bind(this));
		socket.on('startGame', this.startGame.bind(this));
		socket.on('showViewport', this.showViewport.bind(this));

	}];
});