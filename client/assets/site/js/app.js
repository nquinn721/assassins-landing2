var app = angular.module('site', ['ngRoute', 'ngSanitize']);

var socket = io.connect();

app.config(function ($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl : '/an-home',
			controller : 'home',
			controllerAs : 'home'
		})
		.when('/account', {
			templateUrl : '/an-account',
			controller : 'accountMenu',
			controllerAs : 'acc'
		})
		.when('/game', {
			templateUrl : '/an-game',
			controller : 'game',
			controllerAs : 'game'
		})
		.when('/game-stats', {
			templateUrl : '/an-game-stats',
			controller : 'gameStats',
			controllerAs : 'gs'
		})
		.otherwise({
			redirectTo : '/'
		});
});