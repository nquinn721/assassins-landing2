define("gameClient/map/elements/platforms/wall", ["game/map/elements/platforms/wall"], function (wall) {
	function Wall (obj) {
		this.el = new wall(obj);
		this.sprite = "wall";
	}

	Wall.prototype = {
	}
	return Wall;
});