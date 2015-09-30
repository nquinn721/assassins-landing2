define("gameClient/map/mapManagerClient", [
		'core/emitter',
		'gameClient/map/map',
		'gameClient/character/player/playerManagerClient'
	], function (emitter, map, pm) {


	function MapManagerClient() {
		this.mapElements = [];
	}
	MapManagerClient.prototype = {
		init : function () {
			this.events();
		},
		events : function () {
			emitter.on('createMap', this.createMap.bind(this));
			emitter.on('mapCoords', this.udpateMapItemCoords.bind(this));
			emitter.on('tick', this.tick.bind(this));
			emitter.on('contact', this.contact.bind(this));	
			emitter.on('contactPostSolve', this.contactPostSolve.bind(this));	
			emitter.on('endContact', this.endContact.bind(this));
			emitter.on('mapItemsHP', this.mapItemsHP.bind(this));

			emitter.on('death', this.death.bind(this));
	        emitter.on('revive', this.revive.bind(this));
		},
		createElement : function (item) {
			item.create(this.b2d);
			this.user.addVisibleItem(item);
		},
		destroyElement : function (item) {
			this.user.removeVisibleItem(item);
			item.destroy();
		},
		createMap : function (obj) {
			this.b2d = obj.b2d;
			this.user = pm.getUser();

			for(var i = 0; i < obj.map.length; i++){
				var el = map.create(obj.map[i]);
				this.mapElements.push(el);
				this.createElement(el);
			}
		},
		getById : function (id) {
			for(var i = 0; i < this.mapElements.length; i++)
				if(this.mapElements[i].id === id)
					return this.mapElements[i];
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

			if(a && a[method])a[method](b || obj.two);
			if(b && b[method])b[method](a || obj.one);
		},
		mapItemsHP : function (items) {
			for(var i = 0; i < items.length; i++)
				this.getById(items[i].id).setHP(items[i].hp)
		},
		death : function () {
			for(var i = 0; i < this.mapElements.length; i++){
				this.mapElements[i].destroySprite();
				this.mapElements[i].createSprite({
					filters : ['grayScale']
				})
			}
			
		},
		revive : function () {
			for(var i = 0; i < this.mapElements.length; i++){
				this.mapElements[i].destroySprite();
				this.mapElements[i].createSprite();
			}
		},
		udpateMapItemCoords : function (mapItems) {
			if(!this.mapElements.length || !mapItems)return;

			for(var i = 0; i < mapItems.length; i++){
				var item = this.getById(mapItems[i].id);
				item.updateCoords(mapItems[i]);
			}
		},
		tick : function () {

			for(var i = 0; i < this.mapElements.length; i++){
				var item = this.mapElements[i];
				
				if(item.tick)item.tick();
				if(item.el.tickItem)item.el.tickItem();


				this.checkLoadStatusOfItem(item);

			}
		},
		checkLoadStatusOfItem : function (item) {
			var inRange = this.user.checkIfItemIsInRange(item),
				visible = this.user.hasVisibleItem(item);

			if(inRange && !visible)
				this.createElement(item);
			else if(!inRange && visible)
				this.destroyElement(item);
		}
	}
	return new MapManagerClient;
});