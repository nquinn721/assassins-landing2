define("game/js/viewport", [
	"require", 
	"core/emitter"
	], function (require, emitter) {
	return function () {
		emitter.emit('gameSetup');
	};
});