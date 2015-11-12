define("gameClient/map/elements/pits/spikePit", ["game/map/elements/pits/spikePit"], function (spikePit) {
	function SpikePit (obj) {
		this.el = new spikePit;
		this.sprite = 'spikePit';
		this.images = [];
	}

	SpikePit.prototype = {
		setupSprite : function (stage, opts) {
			var items = this.w / 25;
			for(var i = 0; i < items; i++){
				var img = stage.image(this.sprite, opts);
				img.x = this.x + (i * (this.w / items));
				img.y = this.y - this.h;
				img.scaleX = (this.w / items) / img.image.width;
		        img.scaleY = (this.h / img.image.height) * 2;
		        
				this.images.push(img);
			}
		},
		destroySprite : function () {
			stage.destroy(this.images);
		}
	}
	return SpikePit;
});