define("game/map/elements/element", ['core/b2d', 'core/props'],function (b2d, props) {
	function Element(){
		this.visible = false;
	}

	Element.prototype = {
		initItem : function () {
			if(this.init)this.init();
			this.create();
		},
		create : function () {
			if(this.bodies){
				this.bodies = b2d.rects(this.bodies);
				this.body = this.bodies[0];
			} else
				this.body = b2d.rect(this.obj());
		},
		updateCoords : function (obj) {
			if(!this.body)return;
			this.body.setX(obj.x);
			this.body.setY(obj.y);	
		},
		destroy : function () {
			this.body.destroy();
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
				widthItems : this.widthItems,
				heightItems : this.heightItems,
				b2delement : this.b2delement,
				friction : this.friction,
				density : this.density,
				restitution : this.restitution,
				policies : this.policies,
				elementName : this.elementName,
				categoryBits : this.categoryBits,
				maskBits : this.maskBits,
				heal : this.heal,
				damage : this.damage
			}
		},
		
		tick : function () {
			if(!this.body)return;
			this.x = this.body.getX();
			this.y = this.body.getY();
			if(this.tickItem)this.tickItem();
		},
		extend : function (itemObj, obj) {
			var item = require('game/map/elements/' + itemObj);
			item = new item(obj.id);
			for(var i in this)
				item[i] = this[i];


			for(var i in obj)
				item[i] = obj[i];

			return item;
		}
	}
	return new Element;
});