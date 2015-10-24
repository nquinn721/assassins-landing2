define("gameClient/map/elements/boxes/boxWithPotion", [
		"game/map/elements/boxes/boxWithPotion", 
		"gameClient/stage/stage"
	], function (boxWithPotion, stage) {
	function BoxWithPotion (obj) {
		this.el = new boxWithPotion(obj);
		this.sprites = ['box', 'smallPotion'];
		this.images = [];
		this.spritesDestroyed = 0;
	}
	BoxWithPotion.prototype = {
		setupSprite : function (opts) {
			for(var i = 0; i < this.sprites.length; i++){
				var img = stage.image(this.sprites[i], opts);
				img.x = this.bodies[i].opts.x;
				img.y = this.bodies[i].opts.y;
				img.scaleX = this.bodies[i].opts.w / img.image.width;
		        img.scaleY = this.bodies[i].opts.h / img.image.height;
	        	img.regX = img.image.width / 2;
		        img.regY = img.image.height / 2;
		        stage.index(img, 1 );
		        
		        if(i === 0)this.img = img;
				this.images.push(img);
			}
		},
		tickItem : function () {
			this.images[1].x = this.x;
			this.images[1].y = this.y;
		},
		destroySprite : function () {
			stage.destroy(this.images[this.spritesDestroyed]);
			this.img = this.images[1];
			this.spritesDestroyed++;	
		}
	}
	return BoxWithPotion;
});
