define("game/map/elements/platforms/floor", [], function () {

	function Floor () {
		this.x = 10;
		this.y = 10;
		this.w = 100;
		this.h = 20;
		this.id = 'floor';
		this.groupId = 1;
		this.type = 'static';
		this.policies = ['floor'];
		this.b2delement = 'rect';
		this.elementName = 'floor';

	}
	return Floor;
});