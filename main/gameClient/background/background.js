define("gameClient/background/background", [
		"js/createjs", 
		"core/props"
	], function (createjs, props) {
	function Background () {
		
	}

	Background.prototype = {
		init : function () {
			// this.image = new Image();
			// this.image.src = "/img/background.jpg";
			// this.image.onload = this.onload.bind(this);
			this.img = createjs.image("background");

			this.img.x = 0;
			this.img.y = 0;
	        this.img.scaleY = props.canvas.h / this.img.image.height;
	        this.img.scaleX = props.canvas.w / this.img.image.width;
		}
	}

	return new Background;
})