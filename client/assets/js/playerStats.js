define("js/playerStats", ["core/emitter"], function (emitter) {
	function PlayerStats (player) {
		this.player = player;

		this.menu = $('.character-stats');
		this.totalhp = this.menu.find('.total-hp');
		this.hp = this.menu.find('.current-hp');
		this.character = this.menu.find('.character');
		this.characterImg = this.menu.find('.character-img img');
	}

	PlayerStats.prototype = {
		init : function () {
			this.events();
			this.initStats();
		},
		events : function () {
			emitter.on('tick', this.tick.bind(this));
			emitter.on('revive', this.revive.bind(this));
		},
		initStats : function () {
			var character = this.player.characterClass,
				characterName = character.character.substr(0,1).toUpperCase() + character.character.substr(1);
			this.totalhp.text(character.hp);
			this.hp.text(this.player.hp);
			this.character.text(characterName);
			this.characterImg.attr('src', '/characters/' + character.character + '-stats.png');

		},
		tick : function () {
			this.hp.text(this.player.hp);
			if(this.player.hp <= 0 && !this.dead){
				emitter.emit('death', this.player);
				this.dead = true;
			}
		},
		revive : function () {
			this.dead = false;
		}

	}
	return PlayerStats;
})