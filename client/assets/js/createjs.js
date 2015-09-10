define("js/createjs", ['js/canvas', 'core/emitter'], function (canvas, emitter) {
	function CreateJS () {
      	this.stage = new createjs.Stage(document.getElementById('game'));
        this.objs = [];
	}

	CreateJS.prototype = {
    hit : function () {
      
    },
		ticker : function () {
         	var self = this;
         	createjs.Ticker.addEventListener('tick', function () {
           		emitter.emit('tick');
           		emitter.emit('clientTick');
           		self.tick();
         	});
         	createjs.Ticker.setFPS(60);
         	// createjs.Ticker.useRAF = true;
      	},
		tick : function () {
			// this.stage.update();


      for(var i = 0; i < this.objs.length; i++){
        var obj = this.objs[i];
        canvas.ctx.fillStyle = 'black';
        canvas.ctx.fillRect(obj.hitx - 2, obj.hity - 2, 5, 5);
        canvas.ctx.fillRect(obj.x - 2, obj.y - 2, 5, 5);
        
      }

		}

	}
var cjs = new CreateJS;
      emitter.on('hit', function (obj) {
        cjs.objs.push(obj);
      });

	return cjs;
});