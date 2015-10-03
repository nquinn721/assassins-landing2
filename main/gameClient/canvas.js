define("gameClient/canvas", ['core/props'], function (props) {
	function start(){
		var width = props.canvas.w,
			height = props.canvas.h,
			canvas = document.getElementById('game'),
			debug = document.getElementById('debug');

		canvas.width = debug.width = width;
		canvas.height = debug.height = height;
		
		return {
			canvas : canvas,
			ctx : canvas.getContext('2d'),
			debug : debug,
			debugctx : debug.getContext('2d')
		}
		
	}
	return start;
});
