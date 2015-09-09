define("game/map/elements/platforms/floor", [
		"game/map/elements/element"
	], function (Element) {

	function Floor (obj) {
		this.x = 10;
		this.y = 10;
		this.w = 100;
		this.h = 10;
		this.id = 'floor';
		this.type = 'static';

		for(var i in obj)this[i] = obj[i];

		// Extend Element
		var e = new Element;
		for(var i in e)this[i] = e[i];

	}
	return Floor;
});