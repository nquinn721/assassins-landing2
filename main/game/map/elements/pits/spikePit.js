define("game/map/elements/pits/spikePit", function () {
	function SpikePit () {
		this.x = 10;
		this.y = 10;
		this.w = 100;
		this.h = 20;
		this.id = 'spikePit';
		this.type = 'kinematic';
		this.policies = ['spikePit', 'floor'];
		this.b2delement = 'triangle';
		this.elementName = 'spikePit';
	}

	SpikePit.prototype = {
		create : function (b2d, opts) {
			this.body = b2d.shapes.triangle(opts);
		},
		contact : function () {
			console.log('contacted');
			this.body.destroy();
		}
	}

	return SpikePit;
})