define("gameClient/map/elements/platforms/morefloor", ["game/map/elements/platforms/morefloor"], function (morefloor) {
	function MoreFloor () {
		this.el = new morefloor;
		this.sprite = "morefloor";
		this.images = [];
	}

	MoreFloor.prototype = {
		setupSprite : function (stage, opts) {
			var items = this.w / 50;
			for(var i = 0; i < items; i++){
				var img = stage.image(this.sprite, opts);
				img.x = this.x + (i * (this.w / items));
				img.y = this.y;
				img.scaleX = (this.w / items) / img.image.width;
		        img.scaleY = (this.h / img.image.height);
		        
				this.images.push(img);
			}
		},
		destroySprite : function () {
			stage.destroy(this.images);
		}
	}
	return MoreFloor;
});