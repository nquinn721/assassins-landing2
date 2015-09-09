define("game/map/map", ['core/emitter', 'core/props'], function (emitter, props) {
	function Map() {
		this.map;
	}
	Map.prototype = {
		init : function (map, b2d, user) {
			this.map = map;
			this.user = user;
			this.b2d = b2d;
			this.create();
			this.createWalls();

			emitter.on('playerCoords', this.update.bind(this));
		},
		create : function () {
			for(var i = 0; i < this.map.items.length; i++){
				var item = this.map.items[i];

				if(this.isWithinDistance(item)){
					item.show(this.b2d);
					// var body = this.b2d.rect(item);
					// item.body = body;
					// item.displayed = true;
				}			
			}
		},
		update : function () {
			for(var i = 0; i < this.map.items.length; i++){
				var item = this.map.items[i];
				if(!item.displayed){
					if(this.isWithinDistance(item)){
						item.show(this.b2d);
						// var body = this.b2d.rect(item);
						// item.displayed = true;
						// item.body = body;
					}
				}else{
					if(!this.isWithinDistance(item)){
						// item.body.destroy();
						// item.displayed = false;
						item.hide();
					}
				}

			}
		},
		isWithinDistance : function (item) {
			if(
				item.x + item.w >= this.user.x - props.mapShowingDistance && 
				item.x <= this.user.x + props.mapShowingDistance && 
				item.y + item.h >= this.user.y - props.mapShowingDistance && 
				item.y <= this.user.y + props.mapShowingDistance
			)return true;
			return false;
		},
		createWalls : function () {
			this.b2d.rect({w : props.canvas.w, h : 20, x : 0, y : props.canvas.h - 20, type : 'static'});
			this.b2d.rect({w : props.canvas.w, h : 20, x : 0, y : 0, type : 'static'});
			this.b2d.rect({w : 20, h : props.canvas.h, x : 0, y : 0, type : 'static'});
			this.b2d.rect({w : 20, h : props.canvas.h, x : props.canvas.w - 20, y : 0, type : 'static'});
		}
	}
	return Map;
});