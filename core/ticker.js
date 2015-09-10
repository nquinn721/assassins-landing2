define("core/ticker", ['core/emitter'], function (emitter) {
	function Ticker () {
	}

	Ticker.prototype = {
		start : function (io) {
         	setInterval(function () {
           		emitter.emit('tick');
           		emitter.emit('serverTick', io);
         	}, 1000 / 60);
      	}
	}
	return new Ticker;
});