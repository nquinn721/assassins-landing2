define(function () {
	function Brute () {
		this.character = 'brute';
		this.hp = 2500;
		this.str = 120;
		this.spd = 60;
		this.agi = 30;
		this.def = 60;
	}

	Brute.prototype = {
		name :function  () {
			return this.character.substr(0,1).toUpperCase() + this.character.substr(1);
		}
	}

	return Brute;
})