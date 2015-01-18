/* Controllers of start component */
//______________________________________________________________________________________
var scanningControllers = angular.module('scanning.controllers', ['angularRipple']);
/* Scanning Controllers */
scanningControllers.controller('BluespaceCtrl', 
		['$scope',
         function($scope) {
			$scope.headerTitle = "Scanning";			
}]);

scanningControllers.controller('ScanningRecentlyseenCtrl', 
				['$scope', '$filter',  'bleNotificationChannel', '$cordovaEvothingsBLE', 'bleDeviceService', 
         function($scope,   $filter,    bleNotificationChannel,   $cordovaEvothingsBLE,   bleDeviceService) {
		
      	//this keeps the device list up to date
      	var onKnownDevicesUpdatedHandler = function (updatedData) {
      		$scope.knownBleDevices = bleDeviceService.getKnownDevices();
      		$scope.$apply();
      	};
      	//initial stuff 
      	$scope.knownBleDevices = bleDeviceService.getKnownDevices(); 
		bleNotificationChannel.onKnownDevicesUpdated($scope, onKnownDevicesUpdatedHandler);

}]);

