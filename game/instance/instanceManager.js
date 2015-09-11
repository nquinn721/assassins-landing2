define("game/instance/instanceManager", [
		'core/b2d', 
		'game/instance/instance', 
		'core/emitter'
	], 
	function (b2d, Instance, emitter) {


	function InstanceManager () {
		this.instances = [];
		this.totalInstances = 0;
	}

	InstanceManager.prototype = {
		createInstance : function () {
			var b = new b2d,
				instance;


			b.init();
			b.contact(this.contact.bind(this));


			// Check if an instance has fewer players
			// If so return that one instead of a new one
			for(var i = 0; i < this.instances.length; i++)
				if(!this.instances[i].full())
					return this.instances[i];
				

			instance = new Instance(this, {
		    	b2d : b, 
		    	id : 'instance' + this.totalInstances, 
		    	mapName : 'map' + (this.totalInstances + 1 > 2 ? 2 : 1)
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
			// one = this.getById(one.id);
			// two = this.getById(two.id);

			// if(one instanceof Array)one = one[0];
			// if(two instanceof Array)two = two[0];

			// // console.log(one, two);
			// if(one && one.contact && !one.hasContact){
			// 	one.hasContact = true;
			// 	one.contact(two);
			// }
			// if(two && two.contact && !two.hasContact){
			// 	two.hasContact = true;
			// 	two.contact(one);
			// }
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