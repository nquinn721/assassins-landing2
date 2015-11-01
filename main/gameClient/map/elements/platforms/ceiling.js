define("gameClient/map/elements/platforms/ceiling", ["game/map/elements/platforms/ceiling"], function (ceiling) {
	function Ceiling () {
		this.el = new ceiling;
		this.sprite = "ceiling";
	}

	Ceiling.prototype = {
	}
	return Ceiling;
});