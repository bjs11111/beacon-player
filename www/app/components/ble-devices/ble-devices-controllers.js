/* Controllers of start component */
var bleDevicesControllers = angular.module('bleDevicesControllers', ['bleChannels', 'deviceManagers', 'beaconAPIServices', 'deviceListDirectives']);
 
/*Scanning controller*/
bleDevicesControllers.controller('bleDevicesListCtrl',
				[ '$scope', 'bleScannerChannel','beaconAPIService', 'bleScannerChannel',
         function( $scope,   bleScannerChannel,  beaconAPIService,   bleScannerChannel) {
			   
			$scope.bleDevicesCtrl = {};
			$scope.bleDevicesCtrl.allDevicesList = {};		

	      	
	    	
	    	//this is used to update list after serverdata updated   	
	    	var onFoundDeviceHandler = function(preparedDevice)  { 
	    		console.log('subKnownDeviceUpdatedHandler' + Date.now()); 
				$scope.bleDevicesCtrl.allDevicesList[preparedDevice.bcmsBeaconKey] 	= preparedDevice;
				$scope.$apply();
			};
		
	      	//initial stuff 
	      	var init = function () {
	      		bleScannerChannel.onFoundBleDevice($scope, onFoundDeviceHandler );
	      	}
	      	
	      	init();
	    

}]);