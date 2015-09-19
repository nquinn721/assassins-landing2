define("gameClient/map/map", [
		'gameClient/map/elements/platforms/floor',
		'gameClient/map/elements/platforms/wall',
		'gameClient/map/elements/platforms/ceiling',
		'gameClient/map/elements/platforms/elevator',
		'gameClient/map/elements/platforms/movingplatform',
		'gameClient/map/element'
	], function (Floor, Wall, Ceiling, Elevator, MovingPlatform, Element) {
	
	function Map () {
		this.mapElements = {
			floor : Floor,
			wall : Wall,
			ceiling : Ceiling,
			elevator : Elevator,
			movingplatform : MovingPlatform
		}
		this.element = new Element;
	}

	Map.prototype = {
		create : function (b2d, obj) {
			var item = new this.mapElements[obj.elementName](obj);
			this.element.extend(item);
			item.create(b2d, obj);
			item.init();
			return item;
		}
	}

	return new Map;
});