define("game/map/elements/boxes/boxWithPotion", ["game/map/elements/items/potions/smallPotion"], function (smallPotion) {
	function BoxWithPotion () {
		this.hp = 1200;
		this.x = 100;
		this.y = 200;
		this.w = 15;
		this.h = 25;
		this.id = 'boxWithPotion';
		this.type = 'dynamic';
		this.density = 10;
		this.friction = 0.3;
		this.groupId = 1;
		this.policies = ['item', 'floor'];
		this.elementName = 'boxWithPotion';
		this.handleDestroy = true;

	}
	BoxWithPotion.prototype = {
		init : function () {
			var potion = new smallPotion();
			potion.groupIndex = 1;
			potion.x = this.x + (this.w / 2) - (potion.w / 2);
			potion.y = this.y + this.h - potion.h;
			potion.owner = this.id;
			this.bodies = [this.obj(), potion];
		},

		contact : function (bullet) {
			var policies = bullet.policies.join('');
			if(policies.match('bullet') && !this.boxDestroyed){
				this.hp -= bullet.damageDealt;
				this.isDirty = true;
				if(this.hp <= 0){
					this.destroy();
					this.boxDestroyed = true;
					this.body = this.bodies[1];
				}

			}
			if(this.boxDestroyed && policies.match('player')){
				this.destroy();
				this.potionDestroyed = true;
			}
		}
	}
	return BoxWithPotion;
});