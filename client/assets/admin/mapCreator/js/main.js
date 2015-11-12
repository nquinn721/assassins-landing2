
ADMIN.controller('main', ['$scope', 'stage', '$rootScope', function ($scope, stage, $rootScope) {
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
		openMenu();
	};
	$scope.closeMenu = function () {
		closeMenu();
	};
	$(document).on('keyup', function (e) {
		if(e.keyCode === 77){
			if($scope.menuOpen)
				closeMenu(true);
			else openMenu(true);
		}
	});

	function closeMenu (apply) {
		$('.menu-container').animate({
			left : -400,
		},{
			complete : function () {
				$('.menu-hidden').show();
			}
		});
		$scope.menuOpen = false;
		if(apply) $scope.$apply();
	};
	function openMenu (apply) {
		$('.menu-container').animate({
			left : 0
		});
		$scope.menuOpen = true;
		if(apply) $scope.$apply();
	}
}]);

$('.draggable').draggable({handle : '.title'});
$('[data-toggle="tooltip"]').tooltip();
