var bleDevicesControllers = angular.module('bleDevicesControllers', ['listFilters', 'bleChannels', 'beaconAPIServices', 'generalServices', 'deviceListDirectives']);
//@TODO to implement
bleDevicesControllers.constant("bleDevicesListCtrlConfig", {
	//refreshBeaconListInterval		: ms
	refreshBeaconListInterval 	: 1000 * 5,
	msBeforeBeaconIsOld : 1000 * 10,
})


bleDevicesControllers.controller('bleDevicesListCtrl',
				[ '$scope', '$filter','$interval', 'bleDevicesListCtrlConfig', 'bleScannerChannel','beaconAPIService', 'generalService',
         function( $scope,   $filter,  $interval,   bleDevicesListCtrlConfig,   bleScannerChannel,  beaconAPIService,   generalService) {
			
			$scope.bleDevicesCtrl = {};  
			$scope.bleDevicesCtrl.allDevicesList = {};		
			
			//functions
			$scope.openIABWithKey = generalService.openIABWithKey;
					
			var lastScanFilter =  $filter('lastScanFilter'),
				cleaningOldDevicesInterval = undefined;

			//start interval for cleaning old devices
			var startcleaningOldDevicesinterval = function (interval, timeago) {
                

                 
				timeago = (timeago)?timeago:interval;
				
				if(!cleaningOldDevicesInterval) {
					cleaningOldDevicesInterval = $interval(function() {
                        console.log('interval fired', interval, timeago);
						
						var filteredDevices = lastScanFilter($scope.bleDevicesCtrl.allDevicesList, timeago);
                        console.log(filteredDevices);
						angular.forEach($scope.bleDevicesCtrl.allDevicesList, function(item, key) {
							if(!filteredDevices[key]) {
								console.log('delete', filteredDevices[key], filteredDevices); 
								delete $scope.bleDevicesCtrl.allDevicesList[key];
							}
						});
                       //$scope.bleDevicesCtrl.allDevicesList = lastScanFilter($scope.bleDevicesCtrl.allDevicesList, interval);
						
					}, interval);
				}
			};
			
			//stopt interval for cleaning old devices
			var stopcleaningOldDevicesinterval = function () {
				if(cleaningOldDevicesInterval) {
					$interval.cancel(cleaningOldDevicesInterval);
					cleaningOldDevicesInterval = undefined;
				}
			};
			
	    	//this is used to update list after serverdata updated   	
	    	var onFoundDeviceHandler = function(preparedDevice) { 
	 
	    		var newDevice = {
	    			bcmsBeaconKey	: preparedDevice.bcmsBeaconKey, 
					bcmsBeacon 		: {},
					scanData		: preparedDevice
				};
	    		
	    		//$scope.bleDevicesCtrl.allDevicesList.push(preparedDevice);
	    		$scope.bleDevicesCtrl.allDevicesList[newDevice.bcmsBeaconKey] = newDevice;
				$scope.$apply();
			};
		
	      	//initial stuff 
	      	var init = function () {
	      		console.log('init bleDevicesListCtrl'); 
	      		//startcleaningOldDevicesinterval(bleDevicesListCtrlConfig.msBeforeBeaconIsOld, bleDevicesListCtrlConfig.refreshBeaconListInterval );
	      		bleScannerChannel.onFoundBleDevice($scope, onFoundDeviceHandler);
	      	}
	      	
	      	init();

}]);