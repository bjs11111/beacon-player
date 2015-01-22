/* Controllers of start component */
//______________________________________________________________________________________

var scanningControllers = angular.module('scanning.controllers', ['bleServices', 'bcmsServices', 'LocalForageModule', 'bleFilters']);
/* Scanning Controllers */
scanningControllers.controller('BluespaceCtrl', 
		['$scope',
         function($scope) {
			$scope.headerTitle = "Scanning";			
		}
]);

scanningControllers.controller( 'ScanningRecentlyseenCtrl', 
				['$scope', '$filter',  'bleNotificationChannel', '$cordovaEvothingsBLE', 'bleDeviceService', 'bcmsNotificationChannel', 'bcmsAjaxService', '$localForage',
         function($scope,   $filter,    bleNotificationChannel,   $cordovaEvothingsBLE,   bleDeviceService,   bcmsNotificationChannel,   bcmsAjaxService,   $localForage) {
		
      	//this keeps the device list up to date
      	var onKnownDevicesUpdatedHandler = function (updatedData) {
      		$scope.knownBleDevices = bleDeviceService.getKnownDevices();
      		console.log($scope.knownBleDevices); 
      		$scope.$apply();
      	};
      	
    	var cmsBeaconKeyToObj = null;
      	//initial stuff 
      	var init = function () {
      		cmsBeaconKeyToObj = $filter('cmsBeaconKeyToObj');
	      	$scope.knownBleDevices = bleDeviceService.getKnownDevices(); 
	      	
			bcmsNotificationChannel.onBeaconListUpdated($scope, onBeaconListUpdatedHandler);  
			
			$scope.list = {};
			$scope.msBeforeBeaconIsOld = 500;
      	}
      	
		var onBeaconListUpdatedHandler = function()  {
		
			$localForage.iterate(function(value, key) {
				if(cmsBeaconKeyToObj(key) != false) {
					
					if(value.scanData && value.bcmsBeacon ) {
						$scope.list[key] = value;
					}
				};

			}).then(function(data) {});
			
		};

		init(); 

}]);

