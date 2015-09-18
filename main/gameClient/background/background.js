define("gameClient/background/background", [
		"js/createjs", 
		"core/props"
	], function (createjs, props) {
	function Background () {
		
	}

	Background.prototype = {
		init : function () {
			this.image = new Image();
			this.image.src = "/img/background.jpg";
			this.image.onload = this.onload.bind(this);
			
		},
		onload : function () {
			this.img = new createjs.createjs.Bitmap(this.image);

			this.img.x = 0;
			this.img.y = 0;
	        this.img.scaleY = props.canvas.h / this.image.height;
	        this.img.scaleX = props.canvas.w / this.image.width;
	        createjs.stage.addChild(this.img);
		}
	}

	return new Background;
})