define("gameClient/map/elements/platforms/movingplatform", ["game/map/elements/platforms/movingplatform"], function (movingplatform) {
	function MovingPlatform (obj) {
		this.el = new movingplatform(obj);
		this.sprite = "movingplatform";
	}

	MovingPlatform.prototype = {
	}
	return MovingPlatform;
});