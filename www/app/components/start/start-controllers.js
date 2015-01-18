/* Controllers of start component */
//______________________________________________

var startControllers = angular.module('start.controllers', ['LocalForageModule']);

/* Main Start Controllers */
startControllers.controller('StartCtrl', 
							['$scope','$state', '$ionicSideMenuDelegate', '$cordovaEvothingsBLE', '$localForage',
                     function($scope,  $state,   $ionicSideMenuDelegate,   $cordovaEvothingsBLE,   $localForage) {
	
	$scope.goAndStartScanning = function () {
		$cordovaEvothingsBLE.startScanning(); 
		$state.go('app.scanning');
	};
	
	$scope.loadLocalValue = function() {
		$localForage.getItem('localValue').then(function(data) {
			console.log('loaded: '+data); 
			$scope.localValue = data; 
        });
	}
	
	$scope.setLocalValue = function(val) {
		console.log(val);
		console.log('set: '+val);
		$localForage.setItem('localValue', val);
	}/**/
			
}])