define('game/js/player', function () {
	return function(){
		return {
			players : [],
			characterSelect : {

			},
			set : function (player) {
				var obj = {};

				for(var i in player){
					if(i === 'characters')
						for(var j in player[i])this.characterSelect[player[i][j]] = false;

					obj[i] = player[i];
				}
				for(var i in this)obj[i] = this[i];
				this.players.push(obj);
				return obj;
			},
			createAccounts : function (accounts) {
				var accs = [];
				for(var i = 0; i < accounts.length; i++)
					accs.push(this.set(accounts[i]));
				return accs;
			},
			upper : function () {
				return this.username.substr(0,1).toUpperCase() + this.username.substr(1);
			},
			setCharacter : function (character) {
				for(var i in this.characterSelect) this.characterSelect[i] = false;
				this.characterSelect[character] = true;
				this.character = character;
			},
			charUpper : function () {
				if(this.character)return this.character.substr(0,1).toUpperCase() + this.character.substr(1);	
			},
			getById : function (id) {
				for(var i = 0; i < this.players.length; i++)
					if(this.players[i].username === id) return this.players[i];
			}
		}
	}
});