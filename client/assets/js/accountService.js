define("js/accountService", ['js/app'], function (app) {
	app.service('account', function () {
		return {
			set : function (account) {
				for(var i in account)this[i] = account[i];
			},
			userUpper : function () {
				return this.username.substr(0,1).toUpperCase() + this.username.substr(1);
			}
		}
	});
});