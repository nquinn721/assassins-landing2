define("gameClient/map/elements/platforms/wall", function () {
	function Wall (obj) {
		this.imagew = 40;
		this.imageh = 20;
		this.imagesrc = "/img/wall.png";
		
		for(var i in obj)this[i] = obj[i];


		
	}

	Wall.prototype = {
		
		init : function () {
			
		}

	}
	return Wall;
});