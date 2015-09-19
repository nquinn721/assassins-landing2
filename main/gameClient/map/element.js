	define("gameClient/map/element", [
		'js/createjs',
		'core/emitter'
	], function (createjs, emitter) {
	function Element () {
	}

	Element.prototype = {
		init : function (b2d, obj) {
	        this.create(b2d, obj);
		},
		create : function (b2d) {
			var obj = this.obj();

			// B2D body
			this.body = b2d.rect(obj);
	        this.el.body = this.body;

			// Sprite

			if(this.setupSprite)this.setupSprite();
			else{
				this.img = createjs.image(this.sprite);
				this.img.x = this.x;
				this.img.y = this.y;
		        this.img.scaleY = this.h / this.img.image.height;
		        this.img.scaleX = this.w / this.img.image.width;
			}
			
	        // Header Text
			// this.text = createjs.text(obj.id, null, "#000");
			// this.text.x = obj.x;
			// this.text.y = obj.y - obj.h / 2 - 10;


		},
		events : function () {
		},
		destroy : function () {
			this.body.destroy();
			if(this.destroySprite)this.destroySprite();
			else{
				createjs.destroy(this.img);
				createjs.destroy(this.text);
			}
		},
		tick : function () {
			if(!this.img)return;
			this.img.x = this.el.x = this.el.body.getX();
			this.img.y = this.el.y = this.el.body.getY();
 
		},
		obj : function () {
			return {
				x : this.x,
				y : this.y,
				w : this.w,
				h : this.h,
				id : this.id,
				type : this.type,
				speed : this.speed,
				b2delement : this.b2delement,
				friction : this.friction,
				restitution : this.restitution,
				policies : this.policies,
				elementName : this.elementName,
				heightItems : this.heightItems,
				widthItems : this.widthItems
			}
		},
		extend : function (item, obj) {
			for(var i in this)
				item[i] = this[i];
			for(var i in obj)
				item[i] = obj[i];
			return item;
		}
	}

	return Element;
})