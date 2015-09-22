define("js/createjs", ['js/canvas', 'core/emitter'], function (canvas, emitter) {
	function CreateJS () {
    	this.stage = new createjs.Stage(document.getElementById('game'));
        this.queue = new createjs.LoadQueue(true);

        this.frames = 0;
	}

	CreateJS.prototype = {
        init : function () {
        },
        loadMap : function (map, cb) {
            this.queue.loadManifest("/maps/" + map + "/loadManifest.json");
            this.queue.on("complete", cb, this);
        },
		ticker : function () {
         	var self = this;
         	createjs.Ticker.addEventListener('tick', function () {
           		emitter.emit('tick');
           		emitter.emit('clientTick');
           		self.tick();
                self.frames++;
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
        image : function (id) {
            var bitmap = new createjs.Bitmap(this.queue.getResult(id));
            this.add(bitmap);
            return bitmap;
        },
        spriteSheet : function (data, initialAnimation) {
            var spriteSheet = new createjs.SpriteSheet(data),
                animation = new createjs.Sprite(spriteSheet, initialAnimation || 'standLeft');
            this.add(animation);
            return animation;
        },
        add : function (el) {
            this.stage.addChild(el);
        },
        index : function (child, zIndex) {
            this.stage.setChildIndex(child, zIndex);
        },
        destroy : function (el) {
            if(el instanceof Array)
                for(var i = 0; i < el.length; i++)
                    this.stage.removeChild(el[i]);
            else
                this.stage.removeChild(el);
        }

	}

	return new CreateJS;
});