define("js/responsive", ["core/props", "core/emitter"], function (props, emitter) {
	
	function Responsive (b2d) {
		this.b2d = b2d;
		this.canvas = $('canvas');
	}

	Responsive.prototype = {
		init : function () {
			this.currentWidth = props.canvas.w;
			this.currentHeight = props.canvas.h;	
		},
		resize : function () {
			// $('.viewport, .menu').css({
			// 	width : window.innerWidth - 100,
			// 	height : window.innerHeight - 150,
			// 	marginLeft : 50,
			// 	left : 0
			// });
			$('canvas').css({
				width : $('.viewport').width() * 2,
				height : $('.viewport').height() * 3
			});
			props.canvas.w = $('canvas').width();
			props.canvas.h = $('canvas').height();
			emitter.emit('changeSize', {w : props.canvas.w, h : props.canvas.h});
			// var body = this.b2d.world.GetBodyList();
			// var xRatio = this.canvas.width() / this.currentWidth;
   //    		var yRatio = this.canvas.height() / this.currentHeight;
      		// console.log('owiefj');
		  //   while(body != null) {
		  //   	var obj = body.GetUserData();

				// body.GetWorld().DestroyBody(body);
				// obj.x *= xRatio;
				// obj.y *= yRatio;
				// obj.speed *= xRatio;
				// obj.w *= xRatio;
				// obj.y *= xRatio;
				// this.b2d.rect(obj);

		  //       body = body.GetNext();
		  //   }

		  //   props.canvas.w = this.currentWidth = this.canvas.width();
		  //   props.canvas.h = this.currentHeight = this.canvas.height();
		}
	}

	return Responsive;
});