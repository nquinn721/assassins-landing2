define("gameClient/playerStats", ["core/emitter"], function (emitter) {
	function PlayerStats (player) {
		this.player = player;

		this.menu = $('.character-stats');
		this.totalhp = this.menu.find('.total-hp');
		this.hp = this.menu.find('.current-hp');
		this.kills = this.menu.find('.kills');
		// this.assists = this.menu.find('.assists');
		this.deaths = this.menu.find('.deaths');
		this.character = this.menu.find('.character');
		this.characterImg = this.menu.find('.character-img img');
	}

	PlayerStats.prototype = {
		init : function () {
			this.events();
			this.initStats();
		},
		events : function () {
			this.player.on('changeHP', this.changeHP.bind(this));
			this.player.on(['addKill', 'die'], this.updateKD.bind(this));
		},
		initStats : function () {
			var character = this.player.characterClass,
				characterName = character.character.substr(0,1).toUpperCase() + character.character.substr(1);

			this.totalhp.text(character.hp);
			this.hp.text(this.player.hp);
			this.character.text(characterName);
			this.characterImg.attr('src', '/characters/' + character.character + '-stats.png');

		},
		changeHP : function () {
			if(this.player.hp >= 0)
				this.hp.text(this.player.hp);
		},
		updateKD : function () {
			this.kills.text(this.player.kills);
			this.deaths.text(this.player.deaths);
		}

	}
	return PlayerStats;
})