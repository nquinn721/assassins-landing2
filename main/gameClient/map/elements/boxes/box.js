define("gameClient/map/elements/boxes/box", ["game/map/elements/boxes/box"], function (box) {
	function Box (obj) {
		this.el = new box(obj);
		this.sprite = 'box';

	}

	Box.prototype = {
		// contact : function (bullet) {
			// this.el.contact(bullet);
		// }
	}
	return Box;
});