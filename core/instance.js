if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define("core/instance", ['core/b2d'], function (b2d) {


	function Instance () {
		this.instances = [];
		this.totalInstances = 0;
	}

	Instance.prototype = {
		createInstance : function () {
			var b = new b2d;
			b.init();

		    this.instances.push({b2d : b, id : 'instance' + this.totalInstances});
			this.totalInstances++;
		},
		destroyInstance : function () {
			this.totalInstances--;
		},
		get : function (id) {
			for(var i = 0; i < this.instances.length; i++)
				if(this.instances[i].id === 'instance' + id)
					return this.instances[i];
		}
	}

	// We want the first instance created automatically
	var instance = new Instance;
	instance.createInstance();

	return instance;
})