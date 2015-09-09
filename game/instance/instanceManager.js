define("game/instance/instanceManager", ['core/b2d', 'game/instance/instance', 'core/props'], 
	function (b2d, Instance, props) {


	function InstanceManager () {
		this.instances = [];
		this.totalInstances = 0;
	}

	InstanceManager.prototype = {
		createInstance : function () {
			var b = new b2d,
				instance;

				
			b.init();

			// Check if an instance has fewer players
			// If so return that one instead of a new one
			for(var i = 0; i < this.instances.length; i++)
				if(this.instances[i].totalPlayers < props.playersAloudInInstance)
					return this.instances[i];
				

			instance = new Instance(this, {
		    	b2d : b, 
		    	id : 'instance' + this.totalInstances, 
		    	map : 'map' + (this.totalInstances + 1 > 2 ? 2 : 1)
		    });

		    this.instances.push(instance);
			this.totalInstances++;

			return instance;
		},
		destroyInstance : function (instance) {
			for(var i = 0; i < this.insances.length; i++)
				if(this.instances[i].id === instnace.id)
					this.instances.splice(i, 1);
			this.totalInstances--;
		}
	}

	return new InstanceManager;
})