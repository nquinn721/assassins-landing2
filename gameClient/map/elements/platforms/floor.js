define("gameClient/map/elements/platforms/floor", function () {
	function Floor (obj) {
		this.imagew = 40;
		this.imageh = 20;
		this.imagesrc = "/img/floor.jpg";

		for(var i in obj)this[i] = obj[i];
	}

	Floor.prototype = {
	}
	return Floor;
});