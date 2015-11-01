define("gameClient/map/elements/platforms/movingplatform", ["game/map/elements/platforms/movingplatform"], function (movingplatform) {
	function MovingPlatform () {
		this.el = new movingplatform;
		this.sprite = "movingplatform";
	}

	MovingPlatform.prototype = {
	}
	return MovingPlatform;
});