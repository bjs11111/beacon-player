/* Controllers of start component */
//______________________________________________

var startControllers = angular.module('help.controllers', []);

/* Main Start Controllers */
startControllers.controller('helpCtrl', 
						   ['$scope', '$state', '$ionicSideMenuDelegate', '$cordovaEvothingsBLE',
                    function($scope,   $state,   $ionicSideMenuDelegate,   $cordovaEvothingsBLE) {
	
	$scope.goAndStartScanning = function () {
		$cordovaEvothingsBLE.startScanning(); 
		$state.go('app.scanning');
	};
	
	
				
}])