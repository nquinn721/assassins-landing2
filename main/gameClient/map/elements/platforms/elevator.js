define("gameClient/map/elements/platforms/elevator", ["game/map/elements/platforms/elevator"], function (elevator) {
	function Elevator () {
		this.el = new elevator;
		this.sprite = "elevator";
	}

	Elevator.prototype = {
	}
	return Elevator;
});