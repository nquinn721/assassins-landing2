define("core/ticker", ['core/emitter'], function (emitter) {
	function Ticker () {
	}

	Ticker.prototype = {
		start : function () {
         	setInterval(function () {
           		emitter.emit('tick');
         	}, 1000 / 60);
      	}
	}
	return new Ticker;
});