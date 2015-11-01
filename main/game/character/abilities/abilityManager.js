define("game/character/abilities/abilityManager", [
		"game/character/abilities/shootBullet/shootBullet",
		"core/b2d"
	], function (shootBullet, b2d) {

	function AbilityManager () {

		this.abilities = {
			shootBullet : shootBullet
		}
	}
	AbilityManager.prototype = {
		get : function (ability) {
			ability = new this.abilities[ability](b2d);
			ability.init();
			return ability;
		}

	}
	return AbilityManager;
});