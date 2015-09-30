define("gameClient/background/background", [
		"js/createjs", 
		"core/props",
		"core/emitter"
	], function (createjs, props, emitter) {
	function Background () {
		
	}

	Background.prototype = {
		init : function () {
			this.create();			
	        emitter.on('death', this.death.bind(this));
	        emitter.on('revive', this.create.bind(this));
		},
		death : function () {
			createjs.destroy(this.img);
			this.img = createjs.image("background",{
				filters : ['grayScale']
			});
			this.setImage();
		},
		setImage : function () {
			this.img.x = 0;
			this.img.y = 0;
	        this.img.scaleY = props.canvas.h / this.img.image.height;
	        this.img.scaleX = props.canvas.w / this.img.image.width;
	        createjs.index(this.img, 1);

		},
		create : function () {
			if(this.img)
				createjs.destroy(this.img);
			this.img = createjs.image("background");
			this.setImage();
		}
	}

	return new Background;
})