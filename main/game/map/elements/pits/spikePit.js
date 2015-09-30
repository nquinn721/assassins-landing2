define("game/map/elements/pits/spikePit", function () {
	function SpikePit () {
		this.x = 10;
		this.y = 10;
		this.w = 100;
		this.h = 20;
		this.id = 'spikePit';
		this.type = 'static';
		this.groupId = 1;
		this.policies = ['spikePit', 'floor'];
		this.b2delement = 'triangle';
		this.elementName = 'spikePit';
		this.categoryBits = 0x0001;
	}

	SpikePit.prototype = {
	}

	return SpikePit;
})