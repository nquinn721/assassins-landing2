define("game/character/abilities/abilityManager", [
		"game/character/abilities/shootBullet/shootBullet"
	], function (shootBullet) {

	function AbilityManager (b2d) {
		this.b2d = b2d;

		this.abilities = {
			shootBullet : shootBullet
		}
	}
	AbilityManager.prototype = {
		get : function (ability) {
			ability = new this.abilities[ability](this.b2d);
			ability.init();
			return ability;
		}

	}
	return AbilityManager;
});