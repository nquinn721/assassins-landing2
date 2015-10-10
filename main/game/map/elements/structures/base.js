define("game/map/elements/structures/base", [], function () {
	function Base (base) {
		this.x = 10;
		this.y = 10;
		this.w = 100;
		this.h = 20;
		this.hp = 5000;
		this.originalHp = this.hp;
		this.id = 'base';
		this.type = 'static';
		this.groupId = -1;
		this.policies = ['base'];
		this.b2delement = 'rect';
		this.elementName = 'base';
		this.isDirty = false;
		this.team;
		this.categoryBits = base === 'base0' ? 0x0010 : 0x0020;
		this.maskBits = base === 'base0' ? 0x0100 | 0x1000 | 0x2000 : 0x0200 | 0x1000 | 0x2000;

	}

	Base.prototype = {
		contact : function (obj) {
			if(obj.id.match('bullet') && obj.base !== this.id){
				this.hp -= obj.damageDealt;
				this.isDirty = true;
			}
		}
	}
	return Base;
	
});