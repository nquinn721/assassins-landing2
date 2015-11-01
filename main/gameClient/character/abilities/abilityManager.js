define("gameClient/character/abilities/abilityManager", [
		"gameClient/stage/stage",
		"gameClient/character/abilities/bullet"
	], function (stage, Bullet) {
	function AbilityManager () {
		this.abilities = {
			bullet : Bullet
		}
	}
	AbilityManager.prototype = {
		get : function (ability) {
		
			
			return this.abilities[ability];
		}
	}
	return new AbilityManager;
});