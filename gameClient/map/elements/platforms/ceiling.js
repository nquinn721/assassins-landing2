define("gameClient/map/elements/platforms/ceiling", function () {
	function Ceiling (obj) {
		this.imagew = 40;
		this.imageh = 20;
		this.imagesrc = "/img/ceiling.png";

		for(var i in obj)this[i] = obj[i];

	}

	Ceiling.prototype = {
		
	}
	return Ceiling;
});