define("gameClient/stage/stage", ['core/emitter'], function (emitter) {
	function Stage () {
    	this.stage = new createjs.Stage(document.getElementById('game'));
        this.queue = new createjs.LoadQueue(true);
        this.frames = 0;
	}

	Stage.prototype = {
        init : function () {
        },
        loadMap : function (map, cb) {
            this.queue.loadManifest("/game/map/maps/" + map + "/loadManifest.json");
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
        box : function (color, x, y, w, h) {
            var box = new createjs.Graphics().beginFill(color).drawRect(x, y, w, h);
                box = new createjs.Shape(box);

            this.add(box);
            return box;
        },
        text : function (txt, font, color, x, y) {
            var text = new createjs.Text(txt, font || "20px Arial", color || "white");
            text.x = x;
            text.y = y;
            this.add(text);
            return text;
        },
        image : function (id, options) {
            var bitmap = new createjs.Bitmap(this.queue.getResult(id));
            
            this.handleOptions(bitmap, options);

            this.add(bitmap);
            return bitmap;
        },
        spriteSheet : function (data, initialAnimation, options) {
            var spriteSheet = new createjs.SpriteSheet(data),
                animation = new createjs.Sprite(spriteSheet, initialAnimation || 'standLeft');
            this.handleOptions(animation, options);
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
        },
        hitMarker : function (x, y, w, h) {
            var hit = new createjs.Shape();
            hit.graphics.beginRadialGradientFill(["rgba(0,0,0,0)", "red"], [0, 1], x + (w / 2), y + (h / 2), h - 150, x + (w / 2), y + (h / 2), w - 200);
            hit.graphics.drawRect(x,y,w,h);

            this.add(hit);
            return hit;
        },
        handleOptions : function (bitmap, options) {
              if(options){
                for(var option in options)
                    this[option](bitmap, options[option]);
            }
        },
        filters : function  (el, filtersArray) {
            var filters = [];
            for(var i = 0; i < filtersArray.length; i++)
                filters.push(this[filtersArray[i]]());
            el.filters = filters;
            el.cache(0, 0, el.image.width, el.image.height);
        },
        grayScale : function () {
            
            var Grayscale = new createjs.ColorMatrixFilter([
                    0.30,0.30,0.30,0,0, // red component
                    0.30,0.30,0.30,0,0, // green component
                    0.30,0.30,0.30,0,0, // blue component
                    0,0,0,1,0  // alpha
            ]);
            return Grayscale;
        }

	}

	return new Stage;
});