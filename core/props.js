if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define("core/props", [], function () {
	return {
		canvas : {
			w : 800,
			h : 400
		}
	}
});