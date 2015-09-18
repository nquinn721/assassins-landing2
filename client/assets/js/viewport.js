define('js/viewport', ['core/emitter', 'core/props'], function (emitter, props) {

	function Viewport (user) {
		this.canvas = $('canvas');
		this.user = user;

		this.w = 800;
		this.h = 400;
	}

	Viewport.prototype = {
		init : function () {
			this.focus();
			emitter.on('tick', this.tick.bind(this));
			emitter.on('changeSize', this.updateSize.bind(this));
		},
		updateSize : function (obj) {
			this.w = obj.w;
			this.h = obj.h;
		},
		focus : function () {
			var user = this.user;

			if(user.x > this.w / 2)
				this.canvasLeft(user.x - this.w / 2);

			if(user.y > this.h / 2)
				this.canvasTop(user.y - this.h / 2);
			
			this.canvasBounds();

		},
		canvasTop : function (num) {
			if(typeof num !== 'undefined')this.canvas.css('top', -num);
			return parseInt(this.canvas.css('top'))
		},
		canvasLeft : function (num) {
			if(typeof num !== 'undefined')this.canvas.css('left', -num);
			return parseInt(this.canvas.css('left'));
		},
		canvasBounds : function () {
			if(this.canvasTop() > 0)this.canvasTop(0);
			if(Math.abs(this.canvasTop()) > props.canvas.h - this.h)this.canvasTop(props.canvas.h - this.h);
			if(this.canvasLeft() > 0)this.canvasLeft(0);
			if(Math.abs(this.canvasLeft()) > props.canvas.w - this.w)this.canvasLeft(props.canvas.w - this.w);
		},
		followUser : function () {
			var viewWidth = this.w,
				viewHeight = this.h,
				canvasWidth = props.canvas.w,
				canvasHeight = props.canvas.h,
				user = this.user,
				canvas = this.canvas,
				top = Math.abs(parseInt(canvas.css('top'))),
				left = Math.abs(parseInt(canvas.css('left')));

			// Move canvas left and right
		 	canvas.css('left', -(user.x - viewWidth / 2));
			// Move canvas up and down
		   	canvas.css('top', -(user.y - viewHeight / 2));


			this.canvasBounds();
	   	},
	   	tick : function () {
	   		this.followUser();
	   	}
	}

	return Viewport;
});