define("game/map/maps/map2", [
		"core/props", 
		"game/map/elements/platforms/floor"
		],function (props, Floor) {

	function Map2() {
		this.items = [new Floor({
			x : 100,
			y : 100,
			w : 300
		}),new Floor({
			x : 200,
			y : 250,
			w : 100
		})];

	}
	Map2.prototype = {
	}

	return new Map2;
});