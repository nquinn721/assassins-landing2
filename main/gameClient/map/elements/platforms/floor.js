define("gameClient/map/elements/platforms/floor", ["game/map/elements/platforms/floor"], function (floor) {
	function Floor (obj) {
		this.el = new floor(obj);
		this.sprite = "floor";
	}

	Floor.prototype = {
	}
	return Floor;
});