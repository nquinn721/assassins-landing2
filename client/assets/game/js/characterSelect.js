define("game/js/characterSelect",  function () {
	return ['$scope', 'socket', '$http', 'player',
		function ($scope, socket, $http, player) {
		var self = this;
		this.accounts = [];

		socket.emit('getUser')
		socket.on('user', function (user) {
			self.user = player.set(user);
		});

		socket.emit('getAccounts');
		socket.on('accounts', function (accounts) {
			var accs = [];
			for(var i in accounts){
				var p = player.set(accounts[i]);
				accs.push(p);
			}
			self.accounts = accs;
		});
		socket.on('newAccount', function (account) {
			self.accounts.push(player.set(account));
		});
		socket.on('characterSelected', function (obj) {
			var p = player.getById(obj.id).character = obj.character;
		});

		this.selectCharacter = function (character) {
			this.user.setCharacter(character);
			socket.emit('characterSelected', character);
		};

	}];
});