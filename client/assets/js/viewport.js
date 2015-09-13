define('js/viewport', ['core/emitter', 'core/props'], function (emitter, props) {

	function Viewport (user) {
		this.canvas = $('canvas');
		this.user = user;

		this.width = 800;
		this.height = 400;
	}

	Viewport.prototype = {
		init : function () {
			this.focus();
			emitter.on('tick', this.tick.bind(this));
			emitter.on('changeSize', this.updateSize.bind(this));
		},
		updateSize : function (obj) {
			this.width = obj.w;
			this.height = obj.h;
		},
		focus : function () {
			var user = this.user;

			if(user.x < this.width / 2)
				this.canvas.css('left', -(user.x - this.width / 2));

			var left = Math.abs(parseInt(this.canvas.css('left')));

			if(left + this.width > props.canvas.w)
				this.canvas.css('left', -(props.canvas.w - this.width));
		},
		followUser : function () {
			var viewWidth = this.width,
				viewHeight = this.height,
				canvasWidth = props.canvas.w,
				canvasHeight = props.canvas.h,
				user = this.user,
				canvas = this.canvas,
				top = Math.abs(parseInt(canvas.css('top'))),
				left = Math.abs(parseInt(canvas.css('left')));

			// Move canvas left and right
			if(user.x > viewWidth / 2 && user.x  < canvasWidth - (viewWidth / 2))
			 	canvas.css('left', -(user.x - viewWidth / 2));
			// Move canvas up and down
			if(user.y + user.h > viewHeight / 2 && user.y < canvasHeight - viewHeight / 2)
			   	canvas.css('top', -(user.y - viewHeight / 2));

			if(top > canvasHeight - viewHeight - 20 && user.y > canvasHeight - viewHeight / 2)
				canvas.css('top', -(canvasHeight - viewHeight));

	   	},
	   	tick : function () {
	   		this.followUser();
	   	}
	}

	return Viewport;
});