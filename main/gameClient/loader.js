define("gameClient/loader", function () {
	function Loader () {
		this.loader = $('.loader');
	}
	Loader.prototype = {
		show : function (cb) {
			this.loader.show(cb);
		},
		hide : function (cb) {
			this.loader.hide(cb);
		}
	}
	return Loader;
})