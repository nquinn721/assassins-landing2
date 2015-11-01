define("core/emitter", [], function () {
	function  Emitter() {
		this.events = {};
	}
	Emitter.prototype = {
		on : function (event, cb, order) {
			if(!this.events[event])this.events[event] = [];

			this.events[event].push(cb);
			
		},
		emit : function (event, data) {
			if(this.events[event])
				for(var i = 0; i < this.events[event].length; i++)
						this.events[event][i](data);

		}
	}

	return new Emitter;
});


