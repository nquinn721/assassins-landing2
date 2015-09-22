define("game/map/elements/structures/base", [], function () {
	function Base () {
		this.x = 10;
		this.y = 10;
		this.w = 100;
		this.h = 20;
		this.id = 'base';
		this.type = 'static';
		this.groupId = -1;
		this.policies = ['base'];
		this.b2delement = 'rect';
		this.elementName = 'base';

	}

	Base.prototype = {

	}
	return Base;
	
});