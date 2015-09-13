define("gameClient/map/element", [
		'js/createjs'
	], function (createjs) {
	function Element () {
	}

	Element.prototype = {
		init : function () {
			this.image = new Image();
			this.image.src = this.imagesrc;
	        this.image.onload = this.onload.bind(this);
	       
		},
		onload : function () {
			var bitmap = new createjs.createjs.Bitmap(this.image);
			bitmap.x = this.x;
	        bitmap.y = this.y;

	        bitmap.scaleY = this.h / this.image.height;
	        bitmap.scaleX = this.w / this.image.width;
            createjs.stage.addChild(bitmap);
		},
		tick : function () {
			
		}
	}

	return Element;
})