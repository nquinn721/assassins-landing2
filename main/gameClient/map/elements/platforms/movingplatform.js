define("gameClient/map/elements/platforms/movingplatform", ["game/map/elements/platforms/movingplatform"], function (movingplatform) {
	function MovingPlatform (obj) {
		this.imagew = 40;
		this.imageh = 20;
		this.imagesrc = "/img/movingplatform.png";
		this.el = new movingplatform(obj);

		for(var i in obj)this[i] = obj[i];

	}

	MovingPlatform.prototype = {
	}
	return MovingPlatform;
});