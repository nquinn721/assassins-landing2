define("game/map/elements/element", function () {
	function Element(){
		this.visible = false;
	}

	Element.prototype = {
		initItem : function (b2d) {
			if(this.init)this.init();
			this.create(b2d);
		},
		create : function (b2d) {
			this.body = b2d.rect(this.obj());
		},
		updateCoords : function (obj) {
			if(!this.body)return;
			this.body.setX(obj.x);
			this.body.setY(obj.y);	
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
				restitution : this.restitution,
				policies : this.policies,
				elementName : this.elementName,
				groupId : this.groupId
			}
		},
		
		tick : function () {
			if(!this.body)return;
			this.x = this.body.getX();
			this.y = this.body.getY();
			if(this.tickItem)this.tickItem();
		},
		extend : function (item, obj) {
			var item = require('game/map/elements/' + item);
			item = new item;
			for(var i in this)
				item[i] = this[i];

			for(var i in obj)
				item[i] = obj[i];

			return item;
		}
	}
	return new Element;
});