define("game/character/classes/assassin", [
		"game/character/abilities/abilityManager"
	], function (AbilityManager) {

	function Assassin () {
		this.stats = {
			character : "assassin",
			hp : 2000,
			str : 100,
			spd : 100,
			agi : 60,
			def : 40
		}
	}

	Assassin.prototype = {
		init : function (b2d) {
			var abilityManager = new AbilityManager(b2d);
			this.shootBullet = abilityManager.get('shootBullet');
		},
		name :function  () {
			return this.character.substr(0,1).toUpperCase() + this.character.substr(1);
		},
		mouseDown : function (obj, char) {
			this.shootBullet.shoot(obj, char);
		},
		mouseUp : function (obj) {
			// console.log(obj);
		}
	}

	return Assassin;
})