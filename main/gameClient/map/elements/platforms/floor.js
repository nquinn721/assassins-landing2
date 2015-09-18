define("gameClient/map/elements/platforms/floor", ["game/map/elements/platforms/floor"], function (floor) {
	function Floor (obj) {
		this.imagew = 40;
		this.imageh = 20;
		this.imagesrc = "/img/floor.jpg";
		this.el = new floor(obj);

		for(var i in obj)this[i] = obj[i];
	}

	Floor.prototype = {
	}
	return Floor;
});