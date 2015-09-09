define(["js/canvas", "core/props"], function (canvas, props) {
	function PlayerSprite(player) {
		this.player = player;
	}

	PlayerSprite.prototype = {
		tick : function () {
			canvas.ctx.font = "12px Arial";
			canvas.ctx.fillText(this.player.id, this.player.x - 20, this.player.y - 60);


			canvas.ctx.fillStyle = 'rgba(0,0,0)';
			canvas.ctx.fillRect(this.player.x - 1, this.player.y - 1, 3, 3);

			canvas.ctx.fillStyle = 'rgba(0,0,0,0.2)';
			canvas.ctx.fillRect(this.player.x - props.mapShowingDistance, this.player.y - props.mapShowingDistance, props.mapShowingDistance * 2, props.mapShowingDistance * 2);
		}
	}

	return PlayerSprite;
});