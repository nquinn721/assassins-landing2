define("game/map/elements/platforms/floor", [], function () {

	function Floor (obj) {
		this.x = 10;
		this.y = 10;
		this.w = 100;
		this.h = 20;
		this.id = 'floor';
		this.type = 'static';
		this.policies = ['floor'];
		this.b2delement = 'rect';
		this.elementName = 'floor';

		for(var i in obj)this[i] = obj[i];


	}
	return Floor;
});