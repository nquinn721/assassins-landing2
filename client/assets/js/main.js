require([
	'game/gameManager',
	'js/socket',
	'core/ping',
	'js/canvas',
	'js/canvasControls',
	'gameClient/map/mapMangerClient'
	], 
	function (gameManager, socket, ping, canvas, canvasControls, mapManager) {
		
		
		ping.initClient();
		gameManager.init();
		gameManager.initClient();
		
});




