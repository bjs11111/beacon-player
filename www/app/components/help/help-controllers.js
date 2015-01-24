/* Controllers of start component */
//______________________________________________

var startControllers = angular.module('help.controllers', ['LocalForageModule']);

/* Main Start Controllers */
startControllers.controller('helpCtrl', 
						   ['$scope', '$state', '$localForage', '$ionicSideMenuDelegate', '$cordovaEvothingsBLE',
                    function($scope,   $state,   $localForage,   $ionicSideMenuDelegate,   $cordovaEvothingsBLE) {
	
	$scope.goAndStartScanning = function () {
		$cordovaEvothingsBLE.startScanning(); 
		$state.go('app.scanning');
	};
	
	$scope.clearLocalStorage = function() {
		$localForage.clear(); 
		console.log('cleared'); 
	};
				
}])