define("gameClient/character/classes/class", [], function () {
	function Class () {
		this.abilities = {};
		this.bullets = [];
	}
	Class.prototype = {
		extend : function (obj) {
			for(var i in this)
				obj[i] = this[i];
			return obj;
		},
		mouseDown : function (obj, createjs) {
			var bullet = new this.abilities.bullet;
			bullet.create(obj, createjs);
			this.bullets.push(bullet);
		},
		destroy : function (createjs, bullet) {
			createjs.remove(bullet);
			this.bullets.splice(this.indexOf(bullet));
		}
	}

	return new Class;
});