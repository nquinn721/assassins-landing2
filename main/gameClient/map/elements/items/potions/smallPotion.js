define("gameClient/map/elements/items/potions/smallPotion", ["game/map/elements/items/potions/smallPotion"], function (smallPotion) {
	function SmallPotion (obj) {
		this.el = new smallPotion(obj);
		this.sprite = 'smallPotion';
	}

	SmallPotion.prototype = {
		contact : function (person) {
			var policies = person.policies.join('');
			if(policies.match('player')){
				this.destroyed = true;
				this.destroy();
			}
		}
	}
	return SmallPotion;
	
});