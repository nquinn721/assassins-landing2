define("gameClient/map/elements/platforms/wall", ["game/map/elements/platforms/wall"], function (wall) {
	function Wall (obj) {
		this.imagew = 40;
		this.imageh = 20;
		this.imagesrc = "/img/wall.png";
		this.el = new wall(obj);
		
		for(var i in obj)this[i] = obj[i];

		
	}

	Wall.prototype = {
		
		init : function () {
			
		}

	}
	return Wall;
});