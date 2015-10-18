define("game/map/elements/items/potions/smallPotion", ["core/props"], function (props) {
	function SmallPotion () {
		this.x = 100;
		this.y = 100;
		this.w = 35;
		this.h = 50;
		this.id = 'smallPotion';
		this.type = 'dynamic';
		this.groupId = 1;
		this.heal = 200;
		this.policies = ['item', 'temp', 'heal'];
		this.elementName = 'smallPotion';
	}
	SmallPotion.prototype = {
		contact : function (person) {
			var policies = person.policies.join('');
			if(policies.match('player'))this.destroy();
		}
	}

	return SmallPotion;
});