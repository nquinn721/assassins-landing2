define("js/canvasControls", ['core/emitter'], function (emitter) {
	function CanvasControls() {
		this.small = $('.small');
		this.medium = $('.medium');
		this.large = $('.large');
		this.full = $('.full');

		this.canvas = $('canvas');
		this.view = $('.viewport');

		this.viewRatioWidth = 2;
		this.viewRatioHeight = 1;
		this.canvasRatioWidth = 3;
		this.canvasRatioHeight = 2;
	}

	CanvasControls.prototype = {
		init : function () {
			this.events();
		},
		events : function () {
			this.small.on('click', this.smallView.bind(this));
			this.medium.on('click', this.mediumView.bind(this));
			this.large.on('click', this.largeView.bind(this));
			this.full.on('click', this.fullView.bind(this));
		},
		smallView : function () {
			this.resize($(window).width() / 4);
		},
		mediumView : function () {
			this.resize($(window).width() / 1.4);
		},
		largeView : function () {
			this.resize($(window).width());
		},
		fullView : function () {
			
		},
		resize : function (size) {
			size = size / 2;
			this.canvas.width(size * this.canvasRatioWidth).height(size * this.canvasRatioHeight);
			this.view.width(size * this.viewRatioWidth).height(size * this.viewRatioHeight);
			this.view.css('margin-left', -(size));
		    emitter.emit('changeSize', {w : this.view.width(), h : this.view.height()});
		}
	}
	var cc = new CanvasControls;
	cc.init();
	return cc;
});