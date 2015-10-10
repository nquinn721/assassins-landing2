define("game/js/app", [
		'require',
		'angular', 
		'game/js/io',
		'game/js/player',
		'game/js/characterSelect',
		'game/js/events',
		'game/js/viewport',
		'game/js/gameStats'
	], function (require, angular, io, player, characterSelect, events, viewport, gameStats) {
		
		require(['ngRoute'], function () {
			
			var app = angular.module('assassins-landing', ['ngRoute']);



			app.config(function ($routeProvider) {
				$routeProvider
					.when('/', {
						templateUrl : '/character-select',
						controller : 'characterSelect',
						controllerAs : 'ch'
					})
					
					.otherwise({
						redirectTo : '/'
					});
			})
			.controller('characterSelect', characterSelect)
			.controller('viewport', viewport)
			.controller('gameStats', gameStats)
			.factory('events', events)
			.factory('player', player)
			.factory('socket', io);

			angular.element(document).ready(function() {
		        angular.bootstrap(document, ['assassins-landing']);
		    });
		})

});