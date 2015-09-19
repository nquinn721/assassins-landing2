define("gameClient/map/map", [
		'gameClient/map/elements/platforms/floor',
		'gameClient/map/elements/platforms/wall',
		'gameClient/map/elements/platforms/ceiling',
		'gameClient/map/elements/platforms/elevator',
		'gameClient/map/elements/platforms/movingplatform',
		'gameClient/map/elements/pits/spikePit',
		'gameClient/map/element'
	], function (Floor, Wall, Ceiling, Elevator, MovingPlatform, SpikePit, Element) {
	
	function Map () {
		this.mapElements = {
			floor : Floor,
			wall : Wall,
			ceiling : Ceiling,
			elevator : Elevator,
			movingplatform : MovingPlatform,
			spikePit : SpikePit
		}
		this.element = new Element;
	}

	Map.prototype = {
		create : function (obj) {
			var item = new this.mapElements[obj.elementName](obj);
			this.element.extend(item, obj);
			// item.init(b2d, obj);
			return item;
		}
	}

	return new Map;
});