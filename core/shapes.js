define("core/shapes", ['core/lib/underscore'], function (_) {
	function Shapes (b2d) {
		this.SCALE = 30;

		this.b2d = b2d;
	}

	Shapes.prototype = {
		maze : function () {
			this.polygon({
				maze : [[1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,0,1],[1,0,0,0,1,0,0,0,1],[1,0,1,0,1,0,1,1,1],[1,0,1,0,1,0,0,0,1],[1,0,1,1,1,1,1,0,1],[1,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1]]
			})
		},
		triangle : function (opts) {
			var coords = this.coords(opts),
				options = _.extend({
					points : this.buildPoints([
						{x: coords.x, y: coords.y}, 
						{x: coords.w + coords.x, y: coords.h + coords.y},
						{x: coords.x - coords.w , y: coords.h + coords.y}
					]), x : 0, y : 0
				}, opts);

			return this.polygon(options);
		},
		person : function (opts, opts1) {
			var options = _.extend({
				w : 20,
				h : 20,
				x : 100,
				y : 100
			}, opts),
			options1 = _.extend({
				w : 30,
				h : 30,
				x : 120,
				y : 40
			}, opts1);
			this.b2d.joint(options, options1);
		},
		rightTriangle : function (opts) {
			var coords = this.coords(opts);
				coords.x = coords.x - 5,
				facingRight = this.buildPoints([
					{x : coords.x, y : coords.y},
					{x : coords.x + coords.w, y : coords.y + coords.h},
					{x : coords.x, y : coords.y + coords.h}
				]),
				facingLeft = this.buildPoints([
					{x : coords.x, y : coords.y},
					{x : coords.x - coords.w, y : coords.y + coords.h - 5},
					{x : coords.x, y : coords.y + coords.h - 5}
				]),
				options = _.extend({
					points : opts && opts.right ? facingRight : facingLeft, 
					x : 0,
					y : 0
				}, opts);
			return this.polygon(options);
		},
		octogon : function (opts) {
			var coords = this.coords(opts),
				options = _.extend({
					points : this.buildPoints([
						{x : coords.x + 5,  y : coords.y},
						{x : coords.x + 20, y : coords.y + 18},
						{x : coords.x + 20, y : coords.y + 42},
						{x : coords.x + 05, y : coords.y + 60},
						{x : coords.x - 25, y : coords.y + 60},
						{x : coords.x - 40, y : coords.y + 42},
						{x : coords.x - 40, y : coords.y + 18},
						{x : coords.x - 25, y : coords.y}
					]), x : 0, y : 0

				}, opts);

			return this.polygon(options);
		},
		polygon : function (opts) {
			return this.b2d.polygon(opts);
		},
		coords : function (opts) {
			var options = {};
			if(opts){
				for(var i in opts)
					options[i] = opts[i];

				if(typeof opts.h === 'undefined')
					options.h = 20;
				if(typeof opts.w === 'undefined')
					options.w = 20;
				if(typeof opts.x === 'undefined')
					options.x = 20;
				if(typeof opts.y === 'undefined')
					options.y = 20;


				delete opts.x;
				delete opts.y;
				delete opts.h;
				delete opts.w;
			}

			return options;
		},
		buildPoints : function (points) {
			for(var i = 0; i < points.length; i++){
				points[i].x = points[i].x / this.SCALE;
				points[i].y = points[i].y / this.SCALE;
			}
			return points;
		}
	}

	return Shapes;
});