define(["js/canvas"], function (canvas) {
	function PlayerSprite() {
		
	}

	PlayerSprite.prototype = {
		tick : function (player) {
			canvas.ctx.font = "12px Arial";
			canvas.ctx.fillText(player.id, player.x - 20, player.y - 60);
		}
	}

	return PlayerSprite;
});