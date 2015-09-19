define("game/map/map", [
		'core/emitter', 
		'core/props',
		'game/map/elements/element',
		'game/map/matrix',
		
	], function (emitter, props, element, matrix) {

	

	function Map(mapName, b2d) {
		var Map = require("game/map/maps/" + mapName);
		this.map = new Map;
		
		this.b2d = b2d;

		this.frames = 0;
		this.items = [];
	}
	Map.prototype = {
		init : function () {
			this.readMatrix();
			this.create();
			this.events();
		},
		events : function () {
			emitter.on('tick', this.tick.bind(this));
			emitter.on('contact', this.contact.bind(this));	
			emitter.on('contactPostSolve', this.contactPostSolve.bind(this));	
			emitter.on('endContact', this.endContact.bind(this));
		},
		create : function () {
			if(this.map.init)this.map.init();

			for(var i = 0; i < this.items.length; i++)
				this.items[i].initItem(this.b2d);
			
		},
		

		getById : function (id) {
			for(var i = 0; i < this.items.length; i++)
				if(this.items[i].id === id)return this.items[i];
		},
		readMatrix : function () {
			this.items = matrix.map(this.map.matrix);
		},
		contact : function (obj) {
			this.createContact(obj, 'contact');
		},
		contactPostSolve : function (obj) {
			this.createContact(obj, 'contactPostSolve');
		},
		endContact : function (obj) {
			this.createContact(obj, 'endContact');
		},
		createContact : function (obj, method) {
			var a = this.getById(obj.one.id),
				b = this.getById(obj.two.id);

			if(a && a[method])a[method](b);
			if(b && b[method])b[method](a);
		},
		tick : function () {
			for(var i = 0; i < this.items.length; i++)
				if(this.items[i].tick)this.items[i].tick();
		}
	}
	return Map;
});