define("gameClient/character/abilities/abilityManager", [
		"js/createjs",
		"gameClient/character/abilities/bullet"
	], function (createjs, Bullet) {
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