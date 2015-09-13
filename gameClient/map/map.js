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
		create : function (obj) {
			var item = new this.mapElements[obj.elementName](obj);
			this.extendItemWithElement(item);
			item.init();
			return item;
		},
		extendItemWithElement : function (item) {
			for(var i in this.element)
				item[i] = this.element[i];
		}
	}

	return new Map;
});