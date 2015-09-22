define(function () {
	function Assassin () {
		this.character = "assassin";
		this.hp = 2000;
		this.str = 100;
		this.spd = 100;
		this.agi = 60;
		this.def = 40;
	}

	Assassin.prototype = {
		name :function  () {
			return this.character.substr(0,1).toUpperCase() + this.character.substr(1);
		}
	}

	return Assassin;
})