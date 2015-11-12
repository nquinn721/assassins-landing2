define("game/map/elements/boxes/box", function () {
	function Box () {
		this.hp = 600;
		this.x = 10;
		this.y = 10;
		this.w = 15;
		this.h = 25;
		this.id = 'box';
		this.type = 'dynamic';
		this.density = 10;
		this.groupId = 1;
		this.friction = 0.3;
		this.heal = 200;
		this.policies = ['item', 'floor'];
		this.elementName = 'box';
	}
	Box.prototype = {
		contact : function (bullet, cb) {
			var policies = bullet.policies.join('');
			if(policies.match('bullet')){
				this.isDirty = true;
				this.hp -= bullet.damageDealt;
				if(this.hp <= 0){
					this.isDestroyed = true;
					this.destroy();
				}
			}
		}
	}

	return Box;
})