define("gameClient/map/elements/platforms/floor", ["game/map/elements/platforms/floor"], function (floor) {
	function Floor () {
		this.el = new floor;
		this.sprite = "floor";
		this.images = [];
	}

	Floor.prototype = {
		setupSprite : function (stage, opts) {
			var xitems = this.w / 50,
				yitems = this.h / 50;
			for(var i = 0; i < xitems; i++){
				for(var j = 0; j < yitems; j++){
					var img = stage.image(this.sprite, opts);
					img.x = this.x + (i * (this.w / xitems));
					img.y = this.y + (j * (this.h / yitems));
					img.scaleX = 50 / img.image.width;
			        img.scaleY = 50 / img.image.height;
			        
					this.images.push(img);
				}
			}
		},
		destroySprite : function () {
			stage.destroy(this.images);
		}
	}
	return Floor;
});