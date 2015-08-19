var bleDevicesControllers = angular.module('bleDevicesControllers', ['listFilters', 'bleChannels', 'beaconAPIServices', 'generalServices', 'deviceListDirectives']);
//@TODO to implement
bleDevicesControllers.constant("BackgroundProcessConfig", {
	//refreshBeaconListInterval		: ms
	refreshBeaconListInterval 	: 1000 * 30,
	msBeforeBeaconIsOld : 1000 * 10,
})


bleDevicesControllers.controller('bleDevicesListCtrl',
				[ '$scope', '$filter','$interval', 'bleScannerChannel','beaconAPIService', 'generalService',
         function( $scope,   $filter,  $interval,   bleScannerChannel,  beaconAPIService, generalService) {
			
			$scope.bleDevicesCtrl = {};  
			$scope.bleDevicesCtrl.allDevicesList = {};	
			$scope.bleDevicesCtrl.listLength =0;
			
			//functions
			$scope.openIABWithKey = generalService.openIABWithKey;
					
			var lastScanFilter =  $filter('lastScanFilter'),
				cleaningOldDevicesInterval = undefined;

			//start interval for cleaning old devices
			var startcleaningOldDevicesinterval = function (interval, timeago) {
				timeago = (timeago)?timeago:interval;
			
				if(!cleaningOldDevicesInterval) {
					cleaningOldDevicesInterval = $interval(function() {
						//@TODO last ScanFilter is broken
						
						var filteredDevices = lastScanFilter($scope.bleDevicesCtrl.allDevicesList, timeago, 'scanData');
					
						angular.forEach($scope.bleDevicesCtrl.allDevicesList, function(item, key) {
							if(!filteredDevices[key]) {
								delete $scope.bleDevicesCtrl.allDevicesList[key];
							}
						});	
						
						
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
			
	      	$scope.updateListLength = function() {
	    		var i = 0;
	    		for (key in $scope.bleDevicesCtrl.allDevicesList) {
	    			i++; 
	    		}
	    		//used in view
	    		$scope.bleDevicesCtrl.listLength = i;
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
	    		
	    		$scope.updateListLength();
			};
			
			
			var updateListInterval = undefined;
			
			//start interval for cleaning old devices
			var startUpdateListInterval = function (interval) {
				if(!updateListInterval) { 
					
					
					updateListInterval = setInterval(function(){ 
						$scope.updateListLength();
						$scope.$digest();
					}, interval);
					
				}
			};
			
			//stopt interval for cleaning old devices
			var stopUpdateListInterval = function () {
				if(updateListInterval) {
					clearInterval(updateListInterval);
					updateListInterval = undefined;
				}
			};
			
		
	      	//initial stuff 
	      	var init = function () {
	      		console.log('init bleDevicesListCtrl'); 
	      		startcleaningOldDevicesinterval(2*1000, 10000);
	      		startUpdateListInterval(1000);
	      		bleScannerChannel.onFoundBleDevice($scope, onFoundDeviceHandler);
	      	}
	      	
	      	
 
	      	
	      	init();

}]);