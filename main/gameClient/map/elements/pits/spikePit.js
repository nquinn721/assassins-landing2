define("gameClient/map/elements/pits/spikePit", ["game/map/elements/pits/spikePit", "gameClient/stage/stage"], function (spikePit, stage) {
	function SpikePit (obj) {
		this.el = new spikePit;
		this.sprite = 'spike';
		this.images = [];
	}

	SpikePit.prototype = {
		setupSprite : function (opts) {
			var items = this.widthItems;
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