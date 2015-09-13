define("game/map/elements/platforms/wall", [], function () {

	function Wall (obj) {
		this.x = 10;
		this.y = 10;
		this.w = 100;
		this.h = 20;
		this.id = 'wall';
		this.type = 'static';
		this.policies = ['wall'];
		this.b2delement = 'rect';
		this.elementName = 'wall';

		for(var i in obj)this[i] = obj[i];

	}
	return Wall;
});