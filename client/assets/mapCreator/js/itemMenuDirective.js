MC.directive('itemMenu', ['stage', function (stage) {
	var templateUrl = '/items/' + stage.map;
	return {
		restrict: 'E',
		link: function($scope, $el, $attrs) {
		},
	    templateUrl: templateUrl
	}
}]);
