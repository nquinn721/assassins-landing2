var MC = angular.module('mapCreator', []);

MC.controller('main', ['$scope', 'stage', '$rootScope', function ($scope, stage, $rootScope) {
	stage.init();
	$scope.menuSelected = 'items';
	$scope.itemSelected = 0;
	$scope.width = stage.itemWidth;
	$scope.height = stage.itemHeight;
	$scope.menuOpen = true;
	$rootScope.currentItem = '/game/map/maps/map1/img/floor.jpg';

	$scope.loadMap = function (index, map, layout) {
		$scope.mapSelected = index;
		stage.loadMap(map, layout);
	};
	$scope.setWidth = stage.setWidth.bind(stage);
	$scope.setHeight = stage.setHeight.bind(stage);
	$scope.setType = stage.setItem.bind(stage);
	$scope.zoomOut = stage.zoomOut.bind(stage);
	$scope.zoomIn = stage.zoomIn.bind(stage);
	$scope.openMenu = function () {
		$scope.menuOpen = true;
		$('.menu-container').animate({
			left : 0
		});
	};
	$scope.closeMenu = function () {
		$scope.menuOpen = false;
		$('.menu-container').animate({
			left : -400,
		},{
			complete : function () {
				$('.menu-hidden').show();
			}
		});
	};
}]);

$('.draggable').draggable({handle : '.title'});
$('[data-toggle="tooltip"]').tooltip();
