define("gameClient/character/classes/classManager", [
		'gameClient/stage/stage',
		'gameClient/character/classes/assassin',
		'gameClient/character/classes/brute',
		'gameClient/character/classes/class'
	], function (stage, assassin, brute, Class) {


	function ClassManager () {
		this.classes = {
			assassin : assassin,
			brute : brute
		}
	}
	ClassManager.prototype = {
		create : function (cl, player) {
			var characterClass = Class.extend(new this.classes[cl]),
				animation = stage.spriteSheet(characterClass.data, player.directionFacing === 'left' ? 'standLeft' : 'standRight');
			
			characterClass.init();

			animation.scaleX = 50 / 16;
			if(cl.match('assassin'))
				animation.scaleY = 100 / 29;
			else animation.scaleY = 100 / 25;
			animation.regY = -1;

			return {characterClass : characterClass, animation : animation};
		}
	}

	return new ClassManager;
});
