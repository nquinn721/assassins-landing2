define("gameClient/map/elements/platforms/elevator", ["game/map/elements/platforms/elevator"], function (elevator) {
	function Elevator (obj) {
		this.el = new elevator(obj);
		this.sprite = "elevator";
	}

	Elevator.prototype = {
	}
	return Elevator;
});