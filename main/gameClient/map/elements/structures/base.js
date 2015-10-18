define("gameClient/map/elements/structures/base", ["game/map/elements/structures/base"], function (base) {
	function Base (obj) {
		this.el = new base(obj);
		this.sprite = 'base';
	}
	Base.prototype = {
		initSprite : function (stage) {
			this.stage = stage;
			this.hpw = this.w;
			this.hph = 10;
			this.hpx = this.x;
			this.hpy = this.y - 10;

			this.hpbackgound1 = stage.box('#222', 0,0,this.hpw, this.hph);
			this.hpbackgound = stage.box('white', 0,0,this.hpw - 2, this.hph - 2);
			this.hpbar = stage.box("green", 0,0,this.hpw - 4, this.hph - 4);
			this.hpbar.x = this.hpx + 2;
			this.hpbar.y = this.hpy + 2;
			this.hpbackgound.x = this.hpx + 1;
			this.hpbackgound.y = this.hpy + 1;
			this.hpbackgound1.x = this.hpx;
			this.hpbackgound1.y = this.hpy;
			this.setSpriteHP();
		},
		setSpriteHP : function () {
			if(this.hp <= 0)this.stage.destroy(this.hp);
			else this.hpbar.scaleX = this.hp / this.originalHp; 
		},
		// contact : function (obj) {
			// this.el.contact(obj);
		// }
	}
	return Base;
});