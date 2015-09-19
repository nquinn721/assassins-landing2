define("gameClient/map/elements/platforms/ceiling", ["game/map/elements/platforms/ceiling"], function (ceiling) {
	function Ceiling (obj) {
		this.el = new ceiling(obj);

		for(var i in obj)this[i] = obj[i];
	}

	Ceiling.prototype = {
		
	}
	return Ceiling;
});