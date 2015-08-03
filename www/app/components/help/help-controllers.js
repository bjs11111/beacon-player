/* Controllers of start component */
//______________________________________________

var helpControllers = angular.module('helpControllers', ['beaconAPIServices']);

/* Main Start Controllers */
helpControllers.controller('helpCtrl', 
						   ['$scope', '$state', '$timeout',  'beaconAPIChannel',
                    function($scope,   $state,   $timeout,    beaconAPIChannel) {
	
	
	$scope.helpCtrl = {};
	$scope.helpCtrl.loadinBeaconListIsPending = false;
	
	$scope.helpCtrl.goToTour = function() {
		$scope.helpCtrl.loadinBeaconListIsPending = true;
		$state.go('app.tour');
		$timeout(function() {
			$scope.helpCtrl.loadinBeaconListIsPending = false;
		}, 2000); 
	};
	
	init = function() { 
		console.log('init helpCtrl');
		beaconAPIChannel.subGetAllBeaconsSuccess($scope, function() { $scope.helpCtrl.loadinBeaconListIsPending = false; });
		beaconAPIChannel.subGetAllBeaconsError($scope, function() { $scope.helpCtrl.loadinBeaconListIsPending = false; });
	}
	
	init(); 
	
}])