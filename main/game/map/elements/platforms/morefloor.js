define("game/map/elements/platforms/morefloor", function () {
	function MoreFloor () {
		this.x = 10;
		this.y = 10;
		this.w = 100;
		this.h = 20;
		this.id = 'morefloor';
		this.type = 'static';
		this.friction = 0.3;
		this.policies = ['floor'];
		this.b2delement = 'rect';
		this.elementName = 'morefloor';

	}
	return MoreFloor;
})