define("game/map/maps/map1", [
		"core/props",
		"game/map/elements/platforms/floor"
	],
	function (props, Floor) {


	function Map1() {
		this.items = [new Floor({
			x : props.canvas.w / 2,
			y : props.canvas.h / 2,
			w : 200,
			id : 'floor1'
		}),new Floor({
			x : 50,
			y : 300,
			w : 130,
			id : 'floor2'
		})];

	}
	Map1.prototype = {
	}

	return new Map1;
});