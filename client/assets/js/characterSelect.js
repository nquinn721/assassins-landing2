define("js/characterSelect", ["js/app"], function (app) {
	app.controller('characterSelect', ['User', '$location', '$scope', 'socket', 'characters', 'events', 
		function (User, $location, $scope, socket, characters, events) {

		this.user = User;

		$scope.characters = [];

		this.character = 'Assassin';
		this.AssassinSelect = true;

		this.select = function (character) {
			this.AssassinSelect = false;
			this.BruteSelect = false;
			this.character = character;
			this[character + 'Select'] = true;
		}

		this.gotoAccount = function () {
			$location.path('/account');
		}

		this.start = function () {
			$location.path('/match-making');
			socket.emit('start', {
				account : User,
				character : this.character
			});
		}
		this.updateCharacters = function (obj) {
			characters.set(obj);
		}
		socket.on('matchMaking', this.updateCharacters);

	}]);
});