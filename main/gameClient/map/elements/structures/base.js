define("gameClient/map/elements/structures/base", ["game/map/elements/structures/base"], function (base) {
	function Base (obj) {
		this.el = new base(obj);
		this.sprite = 'base';
	}
	Base.prototype = {

	}
	return Base;
});