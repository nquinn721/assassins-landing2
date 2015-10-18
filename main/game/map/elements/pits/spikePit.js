define("game/map/elements/pits/spikePit", function () {
	function SpikePit () {
		this.x = 10;
		this.y = 10;
		this.w = 100;
		this.h = 20;
		this.id = 'spikePit';
		this.type = 'static';
		this.groupId = 1;
		this.policies = ['spikePit', 'floor', 'constantDamage'];
		this.b2delement = 'triangle';
		this.elementName = 'spikePit';
		this.categoryBits = 0x0001;
		this.damage = 50;
	}

	SpikePit.prototype = {
	}

	return SpikePit;
})