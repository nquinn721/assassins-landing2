define("core/body", function () {

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
			this.body.SetPosition({x : (x + this.w / 2) / this.SCALE, y : this.getRealY() / this.SCALE});
		},
		setY : function (y) {
			this.body.SetPosition({x : this.getRealX() / this.SCALE, y : (y + this.h / 2)  / this.SCALE});
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
			this.body.ApplyForce(this.getVec(dir, speed) , this.body.GetPosition() );
		},
		applyImpulse : function (dir, speed) {
			this.body.ApplyImpulse(this.getVec(dir, speed), this.body.GetWorldCenter());	
		},
		setLinearVelocity : function (dir, speed) {
			if(!this.body.IsAwake())
				this.body.SetAwake(true);
			if(dir === 'right') this.body.SetLinearVelocity(new this.b2Vec2(speed, this.body.GetWorldCenter().y));
			else this.body.SetLinearVelocity(new this.b2Vec2(-speed, this.body.GetWorldCenter().y));	
		},
		stopLinearVelocity : function () {
			this.body.SetLinearVelocity(new this.b2Vec2(0,0));
		},
		angle : function () {
			return this.body.GetAngle() / Math.PI * 180;
		},
		move : function (dir, speed) {
			var vel = this.body.GetLinearVelocity(),
				force = 0;

			if(dir === 'right')force = speed;
			if(dir === 'left')force = -speed;

			if(!this.body.IsAwake())
				this.body.SetAwake(true);

			var velChange = force - vel.x;
			var force = this.body.GetMass() * velChange;
			this.body.ApplyImpulse(new this.b2Vec2(force, 0), this.body.GetWorldCenter());
		},
		getVec : function (dir, speed) {
			var vec, 
				speed1 = speed || this.speed,
				speed2 = speed || this.speed;

			if(speed instanceof Array){
				speed1 = speed[0];
				speed2 = speed[1];
			}

			if(dir === 'right')
				vec = new this.b2Vec2((speed || this.speed) * this.SCALE, 0);
			if(dir === 'left')
				vec = new this.b2Vec2(-((speed || this.speed) * this.SCALE), 0);
			if(dir === 'down')
				vec = new this.b2Vec2(0, (speed || this.speed) * this.SCALE);
			if(dir === 'up')
				vec = new this.b2Vec2(0, -((speed || this.speed) * this.SCALE));

			if(dir === 'upright')
				vec = new this.b2Vec2((speed1 || this.speed) * this.SCALE, -((speed2 || this.speed) * this.SCALE));
			if(dir === 'upleft')
				vec = new this.b2Vec2(-((speed1 || this.speed) * this.SCALE),  -((speed2 || this.speed) * this.SCALE));
			if(dir === 'downright')
				vec = new this.b2Vec2((speed1 || this.speed) * this.SCALE, (speed2 || this.speed) * this.SCALE);
			if(dir === 'downleft')
				vec = new this.b2Vec2(-((speed1 || this.speed) * this.SCALE), (speed2 || this.speed) * this.SCALE);

			// Custom
			if(typeof dir === 'object')
				vec = new this.b2Vec2(dir[0] * this.SCALE, dir[1] * this.SCALE);

			return vec;
		},
		destroy : function (cb) {
			var self = this;
			setTimeout(function () {
				self.body.GetWorld().DestroyBody(self.body);
			}, 0);
		},
		destroyJoints : function () {
			var joints = this.body.GetJointList(),
				destroy = [],
				self = this;
			for (var i = 0; i < joints.length; i++) {
			    destroy.push(joints[i].joint);
			}

			setTimeout(function () {
				for(var i = 0; i < destroy.length; i++){
					var joint = destroy[i];
				    self.body.GetWorld().DestroyJoint(joint);
				}
			}, 0);
		}
	}
	return Body;
});
