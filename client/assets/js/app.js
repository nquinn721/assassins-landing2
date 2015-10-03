define("js/app", [
		'angular', 
		'ngRoute',
	], function (angular, ngRoute) {

	var app = angular.module('assassins-landing', ['ngRoute']);



	app.config(function ($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl : '/login',
				controller : 'login',
				controllerAs : 'login'
			})
			.when('/account', {
				templateUrl : '/account',
				controller : 'accountMenu',
				controllerAs : 'acc'
			})
			.when('/character-select', {
				templateUrl : '/character-select',
				controller : 'characterSelect',
				controllerAs : 'ch'
			})
			.when('/match-making', {
				templateUrl : '/match-making',
				controller : 'matchMaking',
				controllerAs : 'ch'
			})
			.when('/viewport', {
				templateUrl : '/viewport',
				controller : 'viewport',
				controllerAs : 'view'
			})
			.when('/game-stats', {
				templateUrl : '/game-stats',
				controller : 'gameStats',
				controllerAs : 'gs'
			})
			.otherwise({
				redirectTo : '/'
			});
	})
	.run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {
	    $rootScope.$on('$routeChangeStart', function (event) {
	        if (!Auth.isLoggedIn())
	            $location.path('/');
	    });
	}]);
	
	return app;
});