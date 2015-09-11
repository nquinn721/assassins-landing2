define("core/ticker", ['core/emitter'], function (emitter) {
	function Ticker () {
		this.interval;
	}

	Ticker.prototype = {
		start : function (io) {
         	this.interval = setInterval(function () {
           		emitter.emit('tick');
           		emitter.emit('serverTick', io);
         	}, 1000 / 60);
      	},
      	kill : function () {
      		clearInterval(this.interval);
      	}
	}
	return new Ticker;
});