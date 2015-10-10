define("gameClient/map/elements/platforms/ceiling", ["game/map/elements/platforms/ceiling"], function (ceiling) {
	function Ceiling (obj) {
		this.el = new ceiling(obj);
		this.sprite = "ceiling";
	}

	Ceiling.prototype = {
	}
	return Ceiling;
});