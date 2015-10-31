define("gameClient/map/map", [
		'gameClient/map/elements/platforms/floor',
		'gameClient/map/elements/platforms/morefloor',
		'gameClient/map/elements/platforms/wall',
		'gameClient/map/elements/platforms/elevator',
		'gameClient/map/elements/platforms/movingplatform',
		'gameClient/map/elements/pits/spikePit',
		'gameClient/map/elements/structures/base',
		'gameClient/map/elements/items/potions/smallPotion',
		'gameClient/map/elements/boxes/box',
		'gameClient/map/elements/boxes/boxWithPotion',
		'gameClient/map/element'
	], function (Floor, MoreFloor, Wall, Elevator, MovingPlatform, SpikePit, Base, SmallPotion, Box, BoxWithPotion, Element) {
	function Map () {
		this.mapElements = {
			floor : Floor,
			morefloor : MoreFloor,
			wall : Wall,
			elevator : Elevator,
			movingplatform : MovingPlatform,
			spikePit : SpikePit,
			base0 : Base,
			base1 : Base,
			smallPotion : SmallPotion,
			box : Box,
			boxWithPotion : BoxWithPotion
		};
		this.element = new Element;
		
	}

	Map.prototype = {
		create : function (obj) {
			var item = new this.mapElements[obj.elementName](obj);
			this.element.extend(item, obj);
			return item;
		}
	}

	return new Map;
});