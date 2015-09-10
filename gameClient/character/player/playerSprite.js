define("gameClient/character/player/playerSprite", [
		"js/canvas", 
		"core/props"
	], function (canvas, props) {

		
	function PlayerSprite(player, account) {
		this.player = player;
		this.account = account;
	}

	PlayerSprite.prototype = {
		tick : function () {
			canvas.ctx.font = "12px Arial";
			canvas.ctx.fillText(this.account.username, this.player.x - 20, this.player.y - 60);


			canvas.ctx.fillStyle = 'rgba(0,0,0)';
			canvas.ctx.fillRect(this.player.x - 1, this.player.y - 1, 3, 3);

			// canvas.ctx.fillStyle = 'black';
			// canvas.ctx.fillRect(this.player.x - this.player.w / 2, this.player.y - this.player.h / 2, this.player.w, this.player.h);

			// canvas.ctx.fillStyle = 'rgba(0,0,0,0.1)';
			// canvas.ctx.fillRect(this.player.x - props.mapShowingDistance, this.player.y - props.mapShowingDistance, props.mapShowingDistance * 2, props.mapShowingDistance * 2);
		}
	}

	return PlayerSprite;
});