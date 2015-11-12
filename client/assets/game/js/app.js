define("game/js/app", [
		'require',
		'angular', 
		'game/js/angulario',
		'game/js/player',
		'game/js/instance',
		'game/js/characterSelect',
		'game/js/events',
		'game/js/viewport',
		'game/js/matchMaking'
	], function (require, angular, io, player, instance, characterSelect, events, viewport, matchMaking) {
		
		require(['ngRoute'], function () {
			
			var app = angular.module('assassins-landing', ['ngRoute']);



			app.config(function ($routeProvider) {
				$routeProvider
					.when('/', {
						templateUrl : '/character-select',
						controller : 'characterSelect',
						controllerAs : 'ch'
					})
					.when('/match-making', {
						templateUrl : '/match-making',
						controller : 'matchMaking',
						controllerAs : 'mm'
					})
					.when('/viewport', {
						templateUrl : '/viewport',
						controller : 'viewport',
						controllerAs : 'view'
					})
					.otherwise({
						redirectTo : '/'
					});
			})
			.controller('characterSelect', characterSelect)
			.controller('viewport', viewport)
			.controller('matchMaking', matchMaking)
			.factory('events', events)
			.factory('player', player)
			.factory('instance', instance)
			.factory('socket', io);

			angular.element(document).ready(function() {
		        angular.bootstrap(document, ['assassins-landing']);
		    });
		})

});