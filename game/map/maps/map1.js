define("game/map/maps/map1", [
		"core/props",
		"game/map/elements/platforms/floor",
		"game/map/elements/platforms/elevator"
	],
	function (props, Floor, Elevator) {


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
		}),new Elevator({
			x : 200,
			y : 200,
			w : 100,
			id : 'floor3'
		})];


	}
	Map1.prototype = {

	}

	return new Map1;
});