define("game/character/classes/brute", [
		"game/character/abilities/abilityManager"
	], function (AbilityManager) {

	function Brute () {
		this.stats = {
			character : 'brute',
			hp : 2500,
			str : 120,
			spd : 60,
			agi : 30,
			def : 60
		}
	}

	Brute.prototype = {
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

	return Brute;
})