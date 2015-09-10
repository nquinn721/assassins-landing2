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
		obj : function () {
			return {
				x : this.x,
				y : this.y,
				w : this.w,
				h : this.h,
				id : this.id,
				type : this.type,
				speed : this.speed
			}
		}
	}
	return Element;
});