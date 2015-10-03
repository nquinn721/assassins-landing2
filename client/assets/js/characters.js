define("js/characters", ['js/app'], function (app) {
	app.service('characters', function () {
		var characters,
			waiting;
		return {
			set : function (obj) {
				characters = obj;
				if(waiting){
					waiting(characters);
					waiting = false;
				}
			},
			get : function (cb) {
				if(characters)cb(characters);
				else wating = cb;
			}
		}
	})
})