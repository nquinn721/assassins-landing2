define("js/viewport", [
	"require", 
	"js/app", 
	"core/emitter"
	], function (require, app, emitter) {
	app.controller('viewport', function () {
		emitter.emit('gameSetup');
	});
});