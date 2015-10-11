define("gameClient/screenTimer", ["core/emitter"], function (emitter) {
	function ScreenTimer () {
		this.timer = $('.screen-timer');
	}
	ScreenTimer.prototype = {
		init : function () {
			emitter.on('death', this.show.bind(this));
			emitter.on('revive', this.hide.bind(this));
		},
		countDown : function (num) {
			var self = this;

			this.timer.find('.num').text(num);
			this.interval = setInterval(function () {
				num--;
				self.timer.find('.num').text(num === 0 ? 'Go!' : num);
				if(num === 0)
					clearInterval(self.interval);
			}, 800);
		},
		show : function (num) {
			this.timer.show();
			this.countDown(num);
		},
		hide : function () {
			this.timer.hide();
		}
	}
	var screenTimer = new ScreenTimer;
	screenTimer.init();
	return screenTimer;
});