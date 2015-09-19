define("js/accountMenu", ['js/createjs'], function (createjs) {
	function AccountMenu (account) {
		this.account = account;
		this.menu = $('.account.menu');
		this.characters = this.menu.find('.characters img');
		this.start = this.menu.find('.start-game input');
	}

	AccountMenu.prototype = {
		init : function () {
			this.events();
		},
		events : function () {
			var self = this;
			this.characters.on('click', function () {
				self.pickCharacter($(this));
			});
		},
		pickCharacter : function (cl) {
			this.character = cl.attr('id');
			this.characters.removeClass('selected');
			cl.addClass('selected');
			this.start.prop("disabled", false);

		}
	}

	return AccountMenu;
});