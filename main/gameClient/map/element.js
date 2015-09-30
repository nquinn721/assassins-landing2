	define("gameClient/map/element", [
		'js/createjs',
		'core/emitter'
	], function (createjs, emitter) {
	function Element () {
	}

	Element.prototype = {
		create : function (b2d, opts) {
			var obj = this.obj();

			// B2D body
			this.body = b2d.rect(obj);
	        this.el.body = this.body;

	        if(this.init)this.init(createjs);
			this.createSprite(opts);

		},
		events : function () {
		},
		destroy : function () {
			this.body.destroy();
			this.destroySprite();
		},
		destroySprite : function () {
			createjs.destroy(this.img);
		},
		createSprite : function (opts) {
			if(this.setupSprite)this.setupSprite();
			else{
				this.img = createjs.image(this.sprite, opts);
				this.img.x = this.x;
				this.img.y = this.y;
		        this.img.scaleY = this.h / this.img.image.height;
		        this.img.scaleX = this.w / this.img.image.width;
				createjs.index(this.img, 1);
				
			}
		},
		setHP :function (hp) {
			this.el.hp = hp;
		},
		updateCoords : function (obj) {
			if(!this.body)return;
			this.body.setX(obj.x);
			this.body.setY(obj.y);	
		},
		tick : function () {
			if(!this.img)return;
			if(this.tickItem)this.tickItem();
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
				widthItems : this.widthItems,
				groupId : this.groupId,
				categoryBits : this.categoryBits,
				maskBits : this.maskBits
			}
		},
		extend : function (item, obj) {
			for(var i in this)
				item[i] = this[i];
			for(var i in obj){
				item.el[i] = obj[i];
				item[i] = obj[i];
			}
	        if(item.el.init)item.el.init();

			return item;
		}
	}

	return Element;
})