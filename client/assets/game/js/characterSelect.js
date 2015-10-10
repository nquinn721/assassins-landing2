define("game/js/characterSelect",  function () {
	return ['$scope', 'socket', '$http', 'player',
		function ($scope, socket, $http, player) {
		var self = this;
		this.accounts = [];



		this.getAccounts = function () {
			socket.emit('getAccounts');
		};
		this.updateAccounts = function (accounts) {
			console.log(accounts);
			this.accounts = player.createAccounts(accounts);
		};
		this.selectCharacter = function (character) {
			this.user.setCharacter(character);
			socket.emit('characterSelected', character);
		};
		this.updateUser = function (user) {
			this.user = player.set(user);
			this.getAccounts();
		};
		this.updateCharacter = function (obj) {
			player.getById(obj.id).character = obj.character;
		};
		this.showStart = function () {
			this.startButton = true;	
		};

		socket.emit('getUser')
		socket.on('user', this.updateUser.bind(this));
		socket.on('accounts', this.updateAccounts.bind(this));
		socket.on('newAccount', this.getAccounts.bind(this));
		socket.on('characterSelected', this.updateCharacter.bind(this));
		socket.on('instanceFull', this.showStart.bind(this));

	}];
});