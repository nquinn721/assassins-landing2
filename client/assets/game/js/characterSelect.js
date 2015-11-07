define("game/js/characterSelect",  function () {
	return ['$scope', 'socket', '$http', 'player', 'instance', '$location',
		function ($scope, socket, $http, player, instance, $location) {
		var self = this;
		this.accounts = [];
		this.notStarted = false;



		this.getAccounts = function () {
			socket.emit('getAccounts');
		};
		this.updateAccounts = function (accounts) {
			this.accounts = player.createAccounts(accounts);
		};
		this.selectCharacter = function (character) {
			this.user.setCharacter(character);
			socket.emit('characterSelected', character);
			if(instance.full)
				this.startButton = true;
		};
		this.updateUser = function (user) {
			this.user = player.set(user);
			this.getAccounts();
			if(this.user.character)
				this.selectCharacter(this.user.character);
			if(instance.full && this.user.character)
				this.startButton = true;
		};
		this.updateCharacter = function (obj) {
			player.getById(obj.id).character = obj.character;
		};
		this.instanceFull = function () {
			instance.setFull();
			this.charactersReady = true;
			if(this.user && this.user.character)
				this.startButton = true;
		};
		this.matchMaking = function () {
			$location.path('/match-making');
		};
		this.stay = function () {
			this.notStarted = true;
		}

		socket.emit('getUser')
		socket.on('user', this.updateUser.bind(this));
		socket.on('accounts', this.updateAccounts.bind(this));
		socket.on('newAccount', this.getAccounts.bind(this));
		socket.on('characterSelected', this.updateCharacter.bind(this));
		socket.on('instanceFull', this.instanceFull.bind(this));
		socket.on('gotoMatchMaking', this.matchMaking.bind(this));
		socket.on('stayInCharacterSelect', this.stay.bind(this));

	}];
});