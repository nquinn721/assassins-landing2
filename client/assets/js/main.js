require([
	'game/gameManager',
	'js/socket',
	], 
	function (gameManager, socket) {
		gameManager.init();
		gameManager.initClient();

});


