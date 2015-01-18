/* Controllers of start component */
//______________________________________________

var startControllers = angular.module('start.controllers', []);

/* Main Start Controllers */
startControllers.controller('StartCtrl', 
							['$scope','$state', '$ionicSideMenuDelegate', '$cordovaEvothingsBLE',
                     function($scope,  $state,   $ionicSideMenuDelegate,   $cordovaEvothingsBLE) {
	
	$scope.goAndStartScanning = function () {
		$cordovaEvothingsBLE.startScanning(); 
		$state.go('app.scanning');
	};
					
}])