define("gameClient/map/elements/structures/base", ["game/map/elements/structures/base"], function (base) {
	function Base (obj) {
		this.el = new base(obj);
		this.sprite = 'base';
	}
	Base.prototype = {
		init : function (stage) {
			this.stage = stage;
			this.hpw = this.el.w;
			this.hph = 10;
			this.hpx = this.el.x;
			this.hpy = this.el.y - 10;

			this.hpbackgound1 = stage.box('#222', 0,0,this.hpw, this.hph);
			this.hpbackgound = stage.box('white', 0,0,this.hpw - 2, this.hph - 2);
			this.hp = stage.box("green", 0,0,this.hpw - 4, this.hph - 4);
			this.hp.x = this.hpx + 2;
			this.hp.y = this.hpy + 2;
			this.hpbackgound.x = this.hpx + 1;
			this.hpbackgound.y = this.hpy + 1;
			this.hpbackgound1.x = this.hpx;
			this.hpbackgound1.y = this.hpy;
		},
		tickItem : function () {
			this.hp.scaleX = this.el.hp / this.el.originalHp;
			if(this.el.hp <= 0)this.stage.destroy(this.hp);
		},
		contact : function (obj) {
			this.el.contact(obj);
		}
	}
	return Base;
});