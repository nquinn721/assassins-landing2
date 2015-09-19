define("gameClient/map/elements/platforms/elevator", ["game/map/elements/platforms/elevator"], function (elevator) {
	function Elevator (obj) {
		this.imagew = 40;
		this.imageh = 20;
		this.imagesrc = "/img/elevator.jpg";
		this.el = new elevator(obj);

		for(var i in obj)this[i] = obj[i];
	}

	Elevator.prototype = {
	}
	return Elevator;
});