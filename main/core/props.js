define("core/props", [], function () {
	return {
		mapShowingDistance : 800,

		canvas : {
			w : 2000,
			h : 1600,
			currentX : 0,
			currentY : 0
		},
		view : {
			w : 1200,
			h : 600
		},

		/**
		 * Category bits are "I am a ..."
		 * Mask bits are "I colide with"
		 */
		collision : {
			team1 : {
				categoryBits : 0x1000,
				maskBits : 0x0100 | 0x0001 | 0x0002
			},
			team2 : {
				categoryBits : 0x2000,
				maskBits : 0x0200 | 0x0001 | 0x0002
			},
			floor : {
				categoryBits : 0x0001
			},
			box : {
				categoryBits : 0x0001
			},
			boxWithPotion : {
				categoryBits : 0x0001
			},
			smallPotion : {
				categoryBits : 0x0002
			},
			bulletteam1 : {
				categoryBits : 0x0200,
				maskBits : 0x2000 | 0x0020 | 0x0001
			},
			bulletteam2 : {
				categoryBits : 0x0100,
				maskBits : 0x1000 | 0x0010 | 0x0001
			},
			base0 : {
				categoryBits : 0x0020,
				maskBits : 0x0200 | 0x2000 | 0x1000 
			},
			base1 : {
				categoryBits : 0x0010,
				maskBits : 0x0100 | 0x1000 | 0x2000
			}
		}
	}
});