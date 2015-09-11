define("game/map/elements/element", function () {
	function Element(){
		this.displayed = false;
	}

	Element.prototype = {
		hide : function () {
			this.body.destroy();
			this.displayed = false;
		},
		show : function (b2d) {
			var body = b2d.rect(this.obj());
			this.body = body;
			this.displayed = true;
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
				friction : this.friction,
				restitution : this.restitution
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