define("gameClient/character/classes/classManager", [
		'js/createjs',
		'gameClient/character/classes/assassin',
		'gameClient/character/classes/brute'
	], function (createjs, assassin, brute) {


	function ClassManager () {
		this.classes = {
			assassin : assassin,
			brute : brute
		}
	}
	ClassManager.prototype = {
		create : function (cl) {
			var characterClass = new this.classes[cl],
				animation = createjs.spriteSheet(characterClass.data, 'standLeft');
				// spriteSheet = new createjs.createjs.SpriteSheet(characterClass.data),
				// animation = new createjs.createjs.Sprite(spriteSheet, 'standLeft');
			
			animation.scaleX = 50 / 16;
			if(cl.match('assassin'))
				animation.scaleY = 100 / 29;
			else animation.scaleY = 100 / 25;
			animation.regY = -1;
			createjs.stage.addChild(animation);
			return {characterClass : characterClass, animation : animation};
		}
	}

	return new ClassManager;
});
