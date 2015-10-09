var app = angular.module('site', ['ngRoute', 'ngSanitize']);


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
		.otherwise({
			redirectTo : '/'
		});
});