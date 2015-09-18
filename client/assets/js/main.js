require([
	'gameClient/gameManagerClient',
	'js/socket',
	'core/ping',
	'js/canvas',
	'js/canvasControls',
	'js/responsive'
	], 
	function (gameManagerClient, socket, ping, canvas, canvasControls, responsive) {
		
		// responsive.init();
		// $(window).on('resize', function () {
		// 	responsive.resize();
		// });


		ping.initClient();
		gameManagerClient.init();
		
});




