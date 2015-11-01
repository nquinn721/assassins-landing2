define('game/js/instance', [], function () {
	return function () {
		return {
			full : false,
			setFull : function () {
				this.full = true;
			}
		}
	};
});