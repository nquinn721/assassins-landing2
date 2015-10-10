define("game/js/matchMaking", [], function () {
	return ['socket', function (socket) {
		var timer;

		this.playersWaiting = [];
		this.loadingTime = 10;
		this.loadingWidth = 0;
		this.time = 0;


		this.matchMaking = function (players) {
			this.playersWaiting = players;
		};
		this.showLoader = function () {
			this.loading = true;	
		};
		this.startGame = function () {
			// var self = this;
			// timer = setInterval(function () {
			// 	self.loadingWidth = (Math.round(self.time / self.loadingTime) * 100) + '%';
			// 	if(self.loadingWidth === '100%')
			// 		clearTimeout(timer);
			// }, 300);
		};
		socket.emit('start');
		socket.on('matchMaking', this.matchMaking.bind(this));
		socket.on('showLoader', this.showLoader.bind(this));
		socket.on('startGame', this.startGame.bind(this));

	}];
});