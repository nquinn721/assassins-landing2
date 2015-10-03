define("gameClient/background/background", [
		"gameClient/stage/stage", 
		"core/props",
		"core/emitter"
	], function (stage, props, emitter) {
	function Background () {
		
	}

	Background.prototype = {
		init : function () {
			this.create();			
	        emitter.on('death', this.death.bind(this));
	        emitter.on('revive', this.create.bind(this));
		},
		death : function () {
			stage.destroy(this.img);
			this.img = stage.image("background",{
				filters : ['grayScale']
			});
			this.setImage();
		},
		setImage : function () {
			this.img.x = 0;
			this.img.y = 0;
	        this.img.scaleY = props.canvas.h / this.img.image.height;
	        this.img.scaleX = props.canvas.w / this.img.image.width;
	        stage.index(this.img, 1);

		},
		create : function () {
			if(this.img)
				stage.destroy(this.img);
			this.img = stage.image("background");
			this.setImage();
		}
	}

	return new Background;
})