define("gameClient/map/elements/platforms/wall", ["game/map/elements/platforms/wall"], function (wall) {
	function Wall () {
		this.el = new wall;
		this.sprite = "wall";
	}

	Wall.prototype = {
	}
	return Wall;
});