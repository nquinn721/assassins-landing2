define("js/matchMaking", function () {
	function MathMaking () {
		this.menu = $('.match-making');
		this.character = this.menu.find('.character');
	}
	MathMaking.prototype = {
		showPlayers : function (characters) {
			this.menu.find('.characters').html('');
			for(var i = 0; i < characters.length; i++)
				this.updateCharacter(characters[i]);
		},
		updateCharacter : function (obj) {
			var ch = this.character.clone();
			ch.find('img').attr('src', '/characters/' + obj.character + '-standstill.png');
			ch.find('.username').text(obj.name);
			ch.find('.character-name').text(obj.character.substr(0,1).toUpperCase() + obj.character.substr(1));
			this.menu.find('.' + obj.team + ' .characters').append(ch);
		}
	}
	return new MathMaking;
});