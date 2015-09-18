define('js/menu', ['core/emitter'], function (emitter) {
	function Menu(){
		this.loaderMenu = $('.loader');
		this.loginMenu = $('.login');
		this.accountMenu = $('.account');
		this.gameMenu = $('.viewport');
		this.error = $('.error');
		this.menus = $('.menu');
		this.loginForm = $('.login form');
		this.startButton = $('.start');
	}

	Menu.prototype = {
		init : function () {
			this.events();	
		},
		events : function () {
			this.loginForm.on('submit', this.login);
			this.startButton.on('click', this.start);
		},
		login : function () {
			emitter.emit('login', {
				username : $(this).find('.username').val(), 
				password : $(this).find('.password').val()
			});
			return false;
		},
		start : function () {
			emitter.emit('start');
		},
		showLoader : function () {
			this.hideMenus();
			this.loaderMenu.show();
		},
		showAccount : function () {
			this.hideMenus();
			this.accountMenu.show();
			this.accountMenu.find('input').focus();
		},
		showGame : function () {
			this.hideMenus();
			this.gameMenu.show();
		},
		showLogin : function () {
			this.hideMenus();
			this.loginMenu.show().find('input').eq(0).focus();
		},
		setAccountInfo : function (obj) {
			this.accountMenu.find('.email').text(obj.email);
			this.accountMenu.find('.username').text(obj.username);
			this.accountMenu.find('.firstName').text(obj.firstName);
			this.accountMenu.find('.lastName').text(obj.lastName);
			this.accountMenu.find('.xp').text(obj.xp);
			this.accountMenu.find('.gold').text(obj.gold);
		},
		showError : function (err) {
			var self = this;
			this.error.show().text(err || 'Something went wrong!');
			setTimeout(function () {
				self.error.hide();
			}, 3000);
		},
		hideMenus : function () {
			this.menus.hide();
		}
	}
	var menu = new Menu;
	menu.init();
	return menu;
});