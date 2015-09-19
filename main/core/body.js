define("core/body", [], function (require) {

	function Body (bodyFixture, b2Vec2, opts) {
		this.body = bodyFixture;
		this.SCALE = 30;
		this.speed = opts && opts.speed ? opts.speed : 5;
		this.b2Vec2 = b2Vec2;
		this.opts = opts;

		this.w = opts.w;
		this.h = opts.h;

	}

	Body.prototype = {
		getX : function () {
			return this.body.GetPosition().x * this.SCALE - (this.w / 2);
		},
		getY : function () {
			return this.body.GetPosition().y * this.SCALE - (this.h / 2);
		},
		setX : function (x) {
			this.body.SetPosition({x : x / this.SCALE, y : this.getRealY() / this.SCALE});
		},
		setY : function (y) {
			this.body.SetPosition({x : this.getRealX() / this.SCALE, y : y  / this.SCALE});
		},
		getRealX : function () {
			return this.body.GetPosition().x * this.SCALE;
		},
		getRealY : function () {
			return this.body.GetPosition().y * this.SCALE;
		},
		left : function () {
			this.move('left');
		},
		right : function () {
			this.move('right');
		},
		applyForce : function (dir, speed) {
			var vec;
			if(dir === 'right')
				vec = new this.b2Vec2((speed || this.speed) * this.SCALE, 0);
			if(dir === 'left')
				vec = new this.b2Vec2(-((speed || this.speed) * this.SCALE), 0);
			if(dir === 'down')
				vec = new this.b2Vec2(0, (speed || this.speed) * this.SCALE);
			if(dir === 'up')
				vec = new this.b2Vec2(0, -((speed || this.speed) * this.SCALE));

			this.body.ApplyForce( vec , this.body.GetPosition() );

		},
		applyImpulse : function (dir, speed) {
			var vec;
			if(dir === 'right')
				vec = new this.b2Vec2((speed || this.speed) * this.SCALE, 0);
			if(dir === 'left')
				vec = new this.b2Vec2(-((speed || this.speed) * this.SCALE), 0);
			if(dir === 'down')
				vec = new this.b2Vec2(0, (speed || this.speed) * this.SCALE);
			if(dir === 'up')
				vec = new this.b2Vec2(0, -((speed || this.speed) * this.SCALE));

			this.body.ApplyImpulse(vec, this.body.GetWorldCenter());	
		},
		move : function (dir) {
			var x = this.getRealX(),
				y = this.getRealY();
				
			if(dir === 'left')
				this.body.SetPosition({x : (x - this.speed) / this.SCALE, y : y / this.SCALE});
			else if(dir === 'right')
				this.body.SetPosition({x : (x + this.speed) / this.SCALE, y : y / this.SCALE});
			else if(dir === 'up')
				this.body.SetPosition({x : x  / this.SCALE, y : (y - this.speed) / this.SCALE});
			else if(dir === 'down')
				this.body.SetPosition({x : x  / this.SCALE, y : (y + this.speed) / this.SCALE});

			
			if(!this.body.IsAwake())
				this.body.SetAwake(true);
		},

		destroy : function (cb) {
			var self = this;
			setTimeout(function () {
				self.body.GetWorld().DestroyBody(self.body);
			}, 0);
		}
	}
	return Body;
});
