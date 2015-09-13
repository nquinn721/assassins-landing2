define("game/map/elements/element", function () {
	function Element(){
		this.displayed = false;
	}

	Element.prototype = {
		hide : function (socket) {
			this.isVisible = false;
			socket.emit('destroyElement', this.id);
		},
		show : function (socket) {
			this.isVisible = true;
			socket.emit('createElement', this.obj());
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
				b2delement : this.b2delement,
				friction : this.friction,
				restitution : this.restitution,
				policies : this.policies,
				elementName : this.elementName
			}
		},
		tick : function () {
			if(!this.body)return;
			if(this.tickItem)this.tickItem();
			this.x = this.body.getX();
			this.y = this.body.getY();
		}
	}
	return Element;
});