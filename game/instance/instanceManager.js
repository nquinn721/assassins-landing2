define("game/instance/instanceManager", [
		'core/b2d', 
		'game/instance/instance',
		'game/map/map',
		'core/emitter'
	], 
	function (B2D, Instance, Map, emitter) {


	function InstanceManager () {
		this.instances = [];
		this.totalInstances = 0;
	}

	InstanceManager.prototype = {
		createInstance : function () {
			var b2d = new B2D,
				instance,
				mapName = 'map1';


			b2d.init();
			b2d.contact(this.contact.bind(this));


			// Check if an instance has fewer players
			// If so return that one instead of a new one
			// for(var i = 0; i < this.instances.length; i++)
			// 	if(!this.instances[i].full())
			// 		return this.instances[i];
				
			var map = new Map(mapName, b2d);
			map.init();
			
			instance = new Instance(this, {
		    	b2d : b2d, 
		    	id : 'instance' + this.totalInstances, 
		    	mapName : mapName, // FUTURE:: UPDATE TO MAP CHOSEN
		    	map : map
		    });


			instance.init();

		    this.instances.push(instance);
			this.totalInstances++;
			return instance;
		},
		contact : function (contact) {
			var one = contact.GetFixtureA().GetBody().GetUserData(),
			  	two = contact.GetFixtureB().GetBody().GetUserData();
			emitter.emit('contact', {one : one, two : two});
		},
		destroyInstance : function (instance) {
			for(var i = 0; i < this.instances.length; i++)
				if(this.instances[i].id === instance.id)
					this.instances.splice(i, 1);
			this.totalInstances--;
		}
	}

	return new InstanceManager;
})