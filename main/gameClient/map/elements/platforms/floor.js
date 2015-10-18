define("gameClient/map/elements/platforms/floor", ["game/map/elements/platforms/floor"], function (floor) {
	function Floor () {
		this.el = new floor;
		this.sprite = "floor";
	}

	Floor.prototype = {
	}
	return Floor;
});