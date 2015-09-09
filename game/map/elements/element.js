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
			var body = b2d.rect(this);
			this.body = body;
			this.displayed = true;
		}
	}
	return Element;
});