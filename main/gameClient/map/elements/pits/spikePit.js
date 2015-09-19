define("gameClient/map/elements/pits/spikePit", ["game/map/elements/pits/spikePit", "js/createjs"], function (spikePit, createjs) {
	function SpikePit (obj) {
		this.el = new spikePit;
		this.sprite = 'spike';
		this.images = [];
	}

	SpikePit.prototype = {
		setupSprite : function () {
			var items = this.widthItems;
			for(var i = 0; i < items; i++){
				var img = createjs.image(this.sprite);
				img.x = this.x + (i * (this.w / items));
				img.y = this.y - this.h;
				img.scaleX = (this.w / items) / img.image.width;
		        img.scaleY = (this.h / img.image.height) * 2;
		        
				this.images.push(img);
			}
		},
		destroySprite : function () {
			createjs.destroy(this.images);
		}
	}
	return SpikePit;
});