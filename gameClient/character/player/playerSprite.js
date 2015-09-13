define("gameClient/character/player/playerSprite", [
		"js/canvas", 
		"core/props",
		"js/createjs"
	], function (canvas, props, createjs) {

		
	function PlayerSprite(player, account) {
		this.player = player;
		this.account = account;

		var data = {
		    images: ["/img/mario-sprite-sheet.png"],
		    frames: {"regX": 10, "height": 29, "count": 10, "regY": 10, "width": 16},
		    animations: {
		        stand:0,
		        run:[1,5],
		        jump:[6,8,"run"]
		    }
		};
		var spriteSheet = new createjs.createjs.SpriteSheet(data);
		this.animation = new createjs.createjs.Sprite(spriteSheet);
		this.animation.scaleX = 50 / 16;
		this.animation.scaleY = 100 / 29;
		createjs.stage.addChild(this.animation);
	}

	PlayerSprite.prototype = {
		tick : function () {

			this.animation.x = this.player.x;
			this.animation.y = this.player.y;
		}
	}

	return PlayerSprite;
});