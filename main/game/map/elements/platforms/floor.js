define("game/map/elements/platforms/floor", [], function () {

	function Floor () {
		this.x = 10;
		this.y = 10;
		this.w = 100;
		this.h = 20;
		this.id = 'floor';
		this.type = 'static';
		this.policies = ['floor'];
		this.b2delement = 'rect';
		this.elementName = 'floor';
		this.categoryBits = 0x0001;

	}
	return Floor;
});