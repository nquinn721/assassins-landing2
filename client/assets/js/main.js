require([
	'gameClient/gameManagerClient',
	'js/socket',
	'core/ping',
	'js/canvas',
	'js/canvasControls',
	'gameClient/map/mapManagerClient',
	'js/responsive'
	], 
	function (gameManagerClient, socket, ping, canvas, canvasControls, mapManager, responsive) {
		mapManager.init();
		
		// responsive.init();
		// $(window).on('resize', function () {
		// 	responsive.resize();
		// });


		ping.initClient();
		gameManagerClient.init();
		
});




