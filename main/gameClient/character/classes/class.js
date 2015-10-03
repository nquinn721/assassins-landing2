define("gameClient/character/classes/class", ["core/emitter", "gameClient/stage/stage"], function (emitter, stage) {
	function Class () {
		this.abilities = {};
		this.bullets = [];
	}
	Class.prototype = {
		init : function () {
			this.initClass();
			emitter.on('tick', this.tick.bind(this));
		},
		extend : function (obj) {
			for(var i in this)
				obj[i] = this[i];
			return obj;
		},
		mouseDown : function (obj) {
			if(!obj)return;
			var bullet = new this.abilities.bullet(obj);
			bullet.create(stage);
			this.bullets.push(bullet);
		},
		destroy : function (bullet) {
			bullet.destroy(stage);
			this.bullets.splice(this.bullets.indexOf(bullet), 1);
		},
		tick : function () {
			var removeBullets = [];


			for(var i = 0; i < this.bullets.length; i++){
				var bullet = this.bullets[i];
				if(!bullet.bullet.destroyed)
					bullet.update();
				else this.destroy(bullet);
			}

			if(removeBullets.length)this.destroy(removeBullets);
		}
	}

	return new Class;
});