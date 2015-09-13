require([
	'game/gameManager',
	'js/socket',
	'core/ping',
	'js/canvas',
	'js/canvasControls',
	'gameClient/map/mapManagerClient',
	'js/responsive'
	], 
	function (gameManager, socket, ping, canvas, canvasControls, mapManager, responsive) {
		mapManager.init();
		
		// responsive.init();
		// $(window).on('resize', function () {
		// 	responsive.resize();
		// });


		ping.initClient();
		gameManager.init();
		gameManager.initClient();
		
});




