require([
	'gameClient/gameManagerClient',
	'js/socket',
	'core/ping',
	'js/canvas',
	'js/canvasControls',
	'js/responsive',
	'js/death'
	], 
	function (gameManagerClient, socket, ping, canvas, canvasControls, responsive, death) {
		
		// responsive.init();
		// $(window).on('resize', function () {
		// 	responsive.resize();
		// });


		ping.initClient();
		gameManagerClient.init();
		
});




