	define("gameClient/map/element", [
		'gameClient/stage/stage',
		'core/b2d',
		'core/emitter',
		'core/props'
	], function (stage, b2d, emitter, props) {
	function Element () {
	}

	Element.prototype = {
		create : function (opts) {
	        if(this.init)this.init();
	        if(this.initSprite)this.initSprite(stage);

			this.createBody();

			this.createSprite(opts);



		},
		createBody : function () {
			if(this.bodies){
				this.bodies = b2d.rects(this.bodies);
				this.body = this.bodies[0];
			} else
				this.body = b2d.rect(this.obj());
		},
		createClient : function () {
			
		},
		events : function () {
		},
		destroy : function () {
			
			this.body.destroy();
			if(this.destroySprite)this.destroySprite();
			else stage.destroy(this.img);
		},
		removeSprite : function () {
			stage.destroy(this.img);
		},
		createSprite : function (opts) {
			if(this.setupSprite)this.setupSprite();
			else{
				this.img = stage.image(this.sprite, opts);
				this.img.x = this.x;
				this.img.y = this.y;
		        this.img.scaleY = this.h / this.img.image.height;
		        this.img.scaleX = this.w / this.img.image.width;
				stage.index(this.img, 1);
				
			}
		},
		setHP :function (hp) {
			this.hp = hp;
			if(this.setSpriteHP)this.setSpriteHP();
		},
		updateCoords : function (obj) {
			if(!this.body)return;
			this.body.setX(obj.x);
			this.body.setY(obj.y);	
		},
		tick : function () {
			if(!this.img)return;
			if(this.tickItem)this.tickItem();
			this.img.x = this.x = this.body.getX();
			this.img.y = this.y = this.body.getY();
 
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
				density : this.density,
				restitution : this.restitution,
				policies : this.policies,
				elementName : this.elementName,
				heightItems : this.heightItems,
				widthItems : this.widthItems,
				groupId : this.groupId,
				categoryBits : this.categoryBits,
				maskBits : this.maskBits,
				heal : this.heal,
				damage : this.damage
			}
		},
		extend : function (item, obj) {
			for(var i in item.el)
				item[i] = item.el[i];
			for(var i in this)
				item[i] = this[i];
			for(var i in obj)
				item[i] = obj[i];

			return item;
		}
	}

	return Element;
})