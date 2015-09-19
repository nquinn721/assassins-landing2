define("gameClient/map/elements/platforms/wall", ["game/map/elements/platforms/wall"], function (wall) {
	function Wall (obj) {
		this.el = new wall(obj);
		
		for(var i in obj)this[i] = obj[i];

		
	}

	Wall.prototype = {
		
		init : function () {
			
		}

	}
	return Wall;
});