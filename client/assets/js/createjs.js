define("js/createjs", ['js/canvas', 'core/emitter'], function (canvas, emitter) {
	function CreateJS () {
      	this.stage = new createjs.Stage(document.getElementById('game'));
	}

	CreateJS.prototype = {
		ticker : function () {
         	var self = this;
         	createjs.Ticker.addEventListener('tick', function () {
           		emitter.emit('tick');
           		self.tick();
         	});
         	createjs.Ticker.setFPS(60);
         	createjs.Ticker.useRAF = true;
      	},
		tick : function () {
			// this.stage.update();
		}
	}
	return new CreateJS;
});