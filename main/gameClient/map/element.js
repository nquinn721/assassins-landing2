	define("gameClient/map/element", [
		'js/createjs',
		'core/emitter'
	], function (createjs, emitter) {
	function Element () {
	}

	Element.prototype = {
		init : function () {
			
	        this.events();
		},
		create : function (b2d, obj) {
			this.body = b2d.rect(obj);
			// var text = createjs.text(obj.id, null, "#000");

			// text.x = obj.x;
			// text.y = obj.y - obj.h / 2 - 10;
		},
		events : function () {
			emitter.on('destroyElement', this.remove.bind(this));	
		},
		onload : function () {
			this.img = new createjs.createjs.Bitmap(this.image);
			this.img.x = this.x;
			this.img.y = this.y;
	        this.img.scaleY = this.h / this.image.height;
	        this.img.scaleX = this.w / this.image.width;
            createjs.stage.addChild(this.img);
		},
		destroy : function () {
			this.body.destroy();
			createjs.stage.removeChild(this.img);
		},
		remove : function (id) {
			if(this.id === id)
				createjs.stage.removeChild(this.img);	
		},
		tick : function () {
			if(!this.img)return;
			if(this.img.x !== this.el.x){
				this.img.x = this.el.x;
				this.img.y = this.el.y;
			}
 
		},
		extend : function (item) {
			for(var i in this)
				item[i] = this[i];
			return item;
		}
	}

	return Element;
})