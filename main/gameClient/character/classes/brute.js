define("gameClient/character/classes/brute",
	["gameClient/character/abilities/abilityManager"],
 	function (abilityManager) {

	function Brute () {
		this.data = {
		    images: ["/characters/brute-spritesheet.png"],
		    frames: [[111, 9, 15, 24], [140, 9, 15, 25], [167, 9, 15, 25], [8, 9, 17, 26], [37, 9, 16, 28], [65, 9, 16, 28], [111, 50, 15, 24], [140, 50, 15, 25], [167, 50, 15, 25], [7, 51, 19, 26], [37, 51, 17, 28], [64, 51, 17, 28], [112, 92, 15, 24], [140, 92, 15, 25], [167, 92, 15, 25], [8, 93, 17, 25], [37, 93, 16, 27], [65, 93, 16, 27], [167, 132, 15, 25], [7, 133, 19, 25], [112, 133, 15, 24], [140, 133, 15, 25], [36, 133, 19, 27], [63, 133, 19, 27]],
		    animations: {
		        standLeft:0,
		        standRight:12,
		        runLeft:{
		        	frames : [0,1,1,2,2,1,1,0],
		        	speed : 0.4
		        },
		        runRight:{
		        	frames : [12,13,13,14,14,13,13,12],
		        	speed : 0.4
		        },
		        jumpLeft:[8],
		        jumpRight: [14]
		    }
		};
		
	}

	Brute.prototype = {
		initClass : function () {
			this.abilities.bullet = abilityManager.get('bullet');
		}

	}

	return Brute;
})