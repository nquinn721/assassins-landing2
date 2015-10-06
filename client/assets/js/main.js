require([
	'angular',
	'js/app',
	'js/io',
	'js/home',
	'js/auth',
	'js/user',
	'js/events',
	'js/viewport',
	'js/gameStats',
	'js/characters',
	'js/matchMaking',
	'js/accountMenu',
	'js/accountService',
	'js/characterSelect',
	'domReady',
	], 
	function (angular, domReady) {
	 angular.element(document).ready(function() {
        angular.bootstrap(document, ['assassins-landing']);
    });
});




