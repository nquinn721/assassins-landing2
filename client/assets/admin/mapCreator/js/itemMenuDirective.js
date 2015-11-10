MC.directive('itemMenu', ['stage', function (stage) {
	var templateUrl = '/mapcreator-menu-items/' + stage.map;
	return {
		restrict: 'E',
		link: function($scope, $el, $attrs) {
		},
	    templateUrl: templateUrl
	}
}]);
