define("js/createjs", ['js/canvas', 'core/emitter'], function (canvas, emitter) {
	function CreateJS () {
      this.createjs = createjs;
    	 this.stage = new createjs.Stage(document.getElementById('game'));
	}

	CreateJS.prototype = {
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
			this.stage.update();

		},
        box : function (color, w, h) {
            var box = new createjs.Graphics().beginFill(color).drawRect(0, 0, w, h);
                box = new createjs.Shape(box);

            this.add(box);
            return box;
        },
        text : function (txt, font, color) {
            var text = new createjs.Text(txt, font || "20px Arial", color || "white");

            this.add(text);
            return text;
        },
        image : function (src, cb) {
            this.image = new Image();
            this.image.src = src;
            this.image.onload = cb;
        },
        add : function (el) {
          this.stage.addChild(el);
        }

	}

	return new CreateJS;
});