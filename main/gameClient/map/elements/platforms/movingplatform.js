define("gameClient/map/elements/platforms/movingplatform", ["game/map/elements/platforms/movingplatform"], function (movingplatform) {
	function MovingPlatform (obj) {
		this.el = new movingplatform(obj);

		for(var i in obj)this[i] = obj[i];

	}

	MovingPlatform.prototype = {
	}
	return MovingPlatform;
});