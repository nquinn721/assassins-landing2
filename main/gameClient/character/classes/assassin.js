define("gameClient/character/classes/assassin", function () {
	function Assassin () {
		this.data = {
		    images: ["/characters/assassin-spritesheet.png"],
		    frames: [[17, 0, 18, 28], [36, 0, 16, 28], [53, 0, 15, 28], [69, 0, 14, 28], [84, 0, 16, 28], [101, 0, 16, 28], [118, 0, 14, 28], [133, 0, 15, 28], [149, 0, 16, 28], [166, 0, 18, 28], [219, 0, 19, 27], [0, 0, 16, 29], [185, 0, 16, 29], [202, 0, 16, 29], [202, 29, 17, 25], [0, 29, 18, 27], [146, 29, 18, 27], [165, 29, 19, 27], [239, 29, 17, 27], [19, 29, 18, 28], [38, 29, 18, 28], [57, 29, 16, 28], [74, 29, 16, 28], [91, 29, 16, 28], [108, 29, 18, 28], [127, 29, 18, 28], [185, 29, 16, 29], [220, 29, 18, 28], [130, 58, 17, 25], [186, 58, 19, 26], [226, 58, 20, 26], [0, 58, 14, 28], [15, 58, 14, 28], [30, 58, 16, 28], [47, 58, 16, 28], [64, 58, 14, 28], [79, 58, 14, 28], [94, 58, 16, 27], [111, 58, 18, 28], [206, 58, 19, 27], [148, 58, 20, 45], [165, 58, 33, 45], [131, 87, 16, 16], [199, 87, 16, 16], [216, 87, 16, 16], [233, 87, 16, 16], [32, 87, 20, 26], [53, 87, 19, 27], [73, 87, 19, 26], [0, 87, 15, 28], [16, 87, 15, 28], [102, 87, 33, 45], [85, 87, 24, 61], [51, 116, 16, 16], [136, 116, 16, 16], [153, 116, 16, 16], [170, 116, 16, 16], [187, 116, 16, 16], [204, 116, 16, 16], [221, 116, 16, 16], [238, 116, 16, 16], [0, 116, 16, 32], [17, 116, 16, 32], [34, 116, 16, 32], [68, 116, 16, 32], [51, 134, 16, 14] ],
		    animations: {
		        standLeft:3,
		        standRight:6,
		        runLeft:{
		        	frames : [3,2,2,1,1,2,2,3],
		        	speed : 0.4
		        },
		        runRight:{
		        	frames : [6,7,7,8,8,7,7,6],
		        	speed : 0.4
		        },
		        jumpLeft:[0],
		        jumpRight: [9],
		        characterClass : [4]
		    }
		};
	}
	Assassin.prototype = {
		
	}

	return Assassin;
})