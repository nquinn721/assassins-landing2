define("js/death", ["core/emitter", "js/menu"], function (emitter, menu) {
	function Death () {
		this.death = $('.death');
	}
	Death.prototype = {
		init : function () {
			this.death.removeClass('.none');
			emitter.on('death', this.showDeath.bind(this));
			emitter.on('revive', this.hideDeath.bind(this));
		},
		countDown : function (num) {
			var self = this;

			this.death.find('.num').text(num);
			this.interval = setInterval(function () {
				num--;
				self.death.find('.num').text(num);
				if(num === 0)
					clearInterval(self.interval);
			}, 1000);
		},
		showDeath : function (player) {
			this.death.show();
			this.countDown(player.deathTimer);
		},
		hideDeath : function () {
			this.death.hide();
		}
	}
	var death = new Death;
	death.init();
	return death;
});