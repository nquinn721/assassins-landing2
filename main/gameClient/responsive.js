define("gameClient/responsive", ["core/props", "core/emitter"], function (props, emitter) {

	function Responsive (b2d) {
		this.b2d = b2d;
		this.canvas = $('canvas');
	}

	Responsive.prototype = {
		init : function () {
			this.currentWidth = props.canvas.w;
			this.currentHeight = props.canvas.h;	
			this.resize();
		},
		resize : function () {
			$('canvas').css({
				width : $('.viewport').width() * 2,
				height : $('.viewport').height() * 3
			});
			props.canvas.w = $('canvas').width();
			props.canvas.h = $('canvas').height();
			emitter.emit('changeSize', {w : props.canvas.w, h : props.canvas.h});

		}
	}

	return new Responsive;
});