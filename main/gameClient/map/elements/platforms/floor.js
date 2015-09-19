define("gameClient/map/elements/platforms/floor", ["game/map/elements/platforms/floor"], function (floor) {
	function Floor (obj) {
		this.el = new floor(obj);

		for(var i in obj)this[i] = obj[i];
	}

	Floor.prototype = {
	}
	return Floor;
});