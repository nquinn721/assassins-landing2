define("game/map/elements/platforms/ceiling", [], function () {

	function Ceiling () {
		this.x = 10;
		this.y = 10;
		this.w = 100;
		this.h = 20;
		this.id = 'ceiling';
		this.type = 'static';
		this.groupId = 1;
		this.policies = ['ceiling'];
		this.b2delement = 'rect';
		this.elementName = 'ceiling';

	}
	return Ceiling;
});