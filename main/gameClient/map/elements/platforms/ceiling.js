define("gameClient/map/elements/platforms/ceiling", ["game/map/elements/platforms/ceiling"], function (ceiling) {
	function Ceiling (obj) {
		this.imagew = 40;
		this.imageh = 20;
		this.imagesrc = "/img/ceiling.png";
		this.el = new ceiling(obj);

		for(var i in obj)this[i] = obj[i];
	}

	Ceiling.prototype = {
		
	}
	return Ceiling;
});