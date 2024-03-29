define("core/b2d", [
	'core/lib/box2d', 
	'core/body', 
	'core/lib/underscore',
	'core/shapes', 
	'core/emitter',
	'core/props'
	], function (Box2D, Body, _, Shapes, emitter, props) {
	var b2Vec2 = Box2D.Common.Math.b2Vec2,
	    b2AABB = Box2D.Collision.b2AABB,
	    b2BodyDef = Box2D.Dynamics.b2BodyDef,
	    b2Body = Box2D.Dynamics.b2Body,
	    b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
	    b2Fixture = Box2D.Dynamics.b2Fixture,
	    b2World = Box2D.Dynamics.b2World,
	    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
	    b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
	    b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
	    b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef,
	    b2WeldJointDef =  Box2D.Dynamics.Joints.b2WeldJointDef,
	    b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef,
	    b2RevoluteJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef,
	    b2Shape = Box2D.Collision.Shapes.b2Shape;

	function B2D() {
		this.box2d = Box2D;
		this.body = Body;

	   	this.SCALE = 30;
	    this.world = new b2World(new b2Vec2(0, 70), true);

	    emitter.on('tick', this.tick.bind(this));
	}

	B2D.prototype = {
		init : function () {
			this.shapes = new Shapes(this);
			this.contactListener();
		},
		ticker : function () {
			this.ownTicker = true;
			this.tick();
		},
		contactListener : function (c) {
			var self = this;



			var contact = new Box2D.Dynamics.b2ContactListener;
			contact.BeginContact = this.beginContact.bind(this);
			contact.EndContact = this.endContact.bind(this);
			contact.PreSolve = this.contactPreSolve.bind(this);
			contact.PostSolve = this.contactPostSolve.bind(this);

			this.world.SetContactListener(contact);

		},
		beginContact : function (contact) {
			this.contact(contact, 'contact');
		},
		endContact : function (contact) {
			this.contact(contact, 'endContact');
		},
		contactPreSolve : function (contact) {
			this.contact(contact, 'contactPreSolve');
		},
		contactPostSolve : function (contact) {
			this.contact(contact, 'contactPostSolve');
		},
		contact : function (contact, event) {
			if(!contact.GetFixtureA)return;
			// if(event == 'contact')
				// console.log(contact.GetFixtureA(), contact.GetFixtureB());


			var one = contact.GetFixtureA().GetBody(),
			  	two = contact.GetFixtureB().GetBody(),
			  	oneData = one.GetUserData(),
			  	twoData = two.GetUserData();

			var contact_point = contact.GetManifold().m_points[0].m_localPoint;

			oneData.hit = {};
			oneData.hit.x = one.GetWorldPoint(contact_point).x * 30;
			oneData.hit.y = one.GetWorldPoint(contact_point).y * 30;
			oneData.sides = {
				left : oneData.x,
				right : oneData.x + oneData.w,
				top : oneData.y,
				bottom : oneData.y + oneData.h
			}

			twoData.hit = {};
			twoData.hit.x = two.GetWorldPoint(contact_point).x * 30;
			twoData.hit.y = two.GetWorldPoint(contact_point).y * 30;
			twoData.sides = {
				left : twoData.x,
				right : twoData.x + twoData.w,
				top : twoData.y,
				bottom : twoData.y + twoData.h
			}
			emitter.emit(event, {one : oneData, two : twoData});
	
		},
		joint : function (opts, opts1, type) {
			var options = _.extend({
					shape : 'rect'
				}, opts),
				options1 = _.extend({
					shape : 'rect'
				}, opts1),
				body = this.bodyDef(options),
				body1 = this.bodyDef(options1),
				fixDef = this.fixDef(options, body),
				fixDef = this.fixDef(options1, body1),
				joint;

			if(type === 'revolute')
				join = this.createRevoluteJoint(body, body1);
			else
				joint = this.createJoint(body, body1);

			return [this.createBody(body, options), this.createBody(body1, options1)];
		},
		rect : function (o) {
			var opts = _.compactObject(o);
				options = _.extend({
					shape : 'rect'
				}, opts),
				body = this.bodyDef(options),
				fixDef = this.fixDef(options, body);

			if(opts.id.match('player')){
				var obj = {
					w : opts.w + 5,
					h : opts.h,
					density : 0,
					friction : 0,
					shape : 'rect',
					elementName : opts.elementName
				}
				this.fixDef(obj, body);
				
			}
			return this.createBody(body, options);
		},
		rects : function (opts) {
			var options = [],
				bodies = [],
				fixtures = [],
				bodyClass = [];

			for(var i = 0; i < opts.length; i++){
				options.push(_.extend({
					shape : 'rect'
				}, _.compactObject(opts[i])));
				bodies.push(this.bodyDef(options[i]));
				fixtures.push(this.fixDef(options[i], bodies[i]));
				bodyClass.push(this.createBody(bodies[i], options[i]));
			}

			for(var i = 0; i < bodies.length; i += 2)
				this.createJoint(bodies[i], opts[i], bodies[i + 1], opts[i + 1]);
			return bodyClass;
		},
		polygon : function (opts) {
			var body = this.bodyDef(opts);
			var fixDef = this.fixDef(opts, body);

			return this.createBody(body, opts);
		},
		createBody : function (body, opts) {
			return new Body(body, b2Vec2, opts);
		},
		fixDef : function (opts, body) {
			var options = _.extend({
				restitution : 0,
				density : 1,
				friction : 0.5,
				shape : 'polygon',
				points : [{x : 1, y : 1}, {x : 2, y : 2}, {x : 0, y : 0}]
			}, opts);

			var fixDef = new b2FixtureDef();


			for(var i in options)fixDef[i] = options[i];

			// Set collision based of props file
			if(props.collision[opts.elementName]){
				fixDef.filter.categoryBits = props.collision[opts.elementName].categoryBits || fixDef.filter.categoryBits;
				fixDef.filter.maskBits = props.collision[opts.elementName].maskBits || fixDef.filter.maskBits;
			}


			if(options.shape === 'polygon'){
				fixDef.shape = new b2PolygonShape();
				this.setAsArray(options.points, fixDef);
			}

			if(options.shape === 'rect'){
				fixDef.shape = new b2PolygonShape();
				fixDef.shape.SetAsBox((opts.w / 2) / this.SCALE, (opts.h / 2) / this.SCALE);
			}

			if(options.shape === 'circle')
				this.fixDef.shape = new b2CircleShape(options.radius);
			
			body.CreateFixture(fixDef);

		},
		createJoint : function (body1, opts1, body2, opts2) {
			//create distance joint between b and c
			var joint_def = new b2WeldJointDef();
			joint_def.bodyA = body1;
			joint_def.bodyB = body2;
			     
			//connect the centers - center in local coordinate - relative to body is 0,0
			joint_def.localAnchorA = new b2Vec2(0,0);
			joint_def.localAnchorB = new b2Vec2(0,0);
			    
			//difference in angle of each body
			joint_def.referenceAngle = 0 * Math.PI / 3;
			     
			//add the joint to the world
			this.world.CreateJoint(joint_def);
			return body1;
			
		},
		distanceJoint : function (body1, fix1, body2, fix2) {
			// Create distance joint
			var jointDef = new b2.DistanceJointDef();
			jointDef.Initialize(body1, body2, fix1.position, topBodyDef.position);
			jointDef.collideConnected = true;
			jointDef.frequencyHz = 100;
			jointDef.dampingRatio = 1;
			var joint = this.world.CreateJoint(jointDef);
		},
		createRevoluteJoint : function (body1, body2) {
			var joint = new b2RevoluteJointDef();
		    joint.Initialize(body1, body2, body1.GetWorldCenter());
		    this.world.CreateJoint(joint);
		    return body1;
		},
		setAsArray : function (points, fixDef) {
			var point = [];

			for (var i = 0; i < points.length; i++) {
			    var vec = new b2Vec2();
			    vec.Set(points[i].x, points[i].y);
			    point[i] = vec;
			}

			fixDef.shape.SetAsArray(point, point.length);
		},
		bodyDef : function (opts) {
			var options = _.extend({
				w : 10, 
				h : 10,
				x : 10,
				y : 10,
				type : 'dynamic',
				linearDamping : 0,
				fixedRotation : false
			}, opts);
			
			var bodyDef = new b2BodyDef();
			bodyDef.type = options.type ? b2Body['b2_' + options.type.toLowerCase() + 'Body'] : b2Body.staticBody;
			bodyDef.position.x = ((options.x + options.w) - (options.w / 2)) / this.SCALE;
			bodyDef.position.y = (options.y + (options.h / 2)) / this.SCALE;
			bodyDef.fixedRotation = options.fixedRotation;
			bodyDef.linearDamping = options.linearDamping;
			bodyDef.userData = options;
			var body = this.world.CreateBody(bodyDef);

			

			return body;	
		},
		debugDraw : function (debugCanvas) {
			if(!debugCanvas)return;

			var debugDraw = new b2DebugDraw();
			debugDraw.SetSprite(debugCanvas);
			debugDraw.SetFillAlpha(0.7);
			debugDraw.SetDrawScale(this.SCALE);
			debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
			this.world.SetDebugDraw(debugDraw);
		},
		tick : function () {
			this.world.DrawDebugData();
			this.world.Step(1/60, 10, 10);
			this.world.ClearForces();


			if(typeof window !== 'undefined' && window.requestAnimationFrame && this.ownTicker)
				window.requestAnimationFrame(this.tick.bind(this));
		}
	}
	var b2d = new B2D;
	b2d.init();
	return b2d;

});