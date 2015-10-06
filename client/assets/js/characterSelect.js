define("js/characterSelect", ["js/app"], function (app) {
	app.controller('characterSelect', ['User', '$scope', 'socket', 'characters', 'events', 
		function (User, $scope, socket, characters, events) {
		this.user = User;
		this.characterSelected = {};
		this.playersSelected = {};


		this.select = function (character) {
			for(var i in this.characterSelected)this.characterSelected[i] = false;
			this.character = character;
			this.characterSelected[character] = true;
			socket.emit('character-select', character);
		}
		this.playerSelect = function (obj) {
			this.playersSelected[obj.player.id] = {username : obj.player.username, character : obj.character};
		}
		this.updatePlayersSelected = function (obj) {
			for(var i in obj)
				this.playersSelected[obj[i].username] = {username : obj[i].username, character : obj[i].characterSelected};
		}


		this.start = function () {
			socket.emit('start', {
				account : User,
				character : this.character
			});
		}
		this.updateCharacters = function (obj) {
			characters.set(obj);
		}
		this.availableChars = function (chars) {
			this.characters = chars;
		}
		this.characterUpper = function (char) {
			return char.substr(0,1).toUpperCase() + char.substr(1);
		}
		socket.on('matchMaking', this.updateCharacters);
		socket.on('availableChars', this.availableChars.bind(this));
		socket.on('character-select', this.playerSelect.bind(this));
		socket.on('characters-selected', this.updatePlayersSelected.bind(this));
		this.select(this.user.characters[0]);

	}]);
});