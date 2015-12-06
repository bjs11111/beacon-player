var bleDevicesControllers = angular.module('drupalionicDemo.bleDevicesControllers', ['commons.filter.listFilters', 'commons.services.ble.bleChannels', 'deviceListDirectives', 'deviceManagers']);
//@TODO to implement
bleDevicesControllers.constant("BackgroundProcessConfig", {
	//refreshBeaconListInterval		: ms
	refreshBeaconListInterval 	: 1000 * 30,
	msBeforeBeaconIsOld : 1000 * 10,
});

bleDevicesControllers.controller('bleDevicesListCtrl',
				[ '$scope', '$filter','$interval', 'bleScannerChannel','bleDeviceChannel','bleDeviceService',
         function( $scope,   $filter,  $interval,   bleScannerChannel,  bleDeviceChannel,  bleDeviceService) {
			
			var vm = this;
			vm.allDevicesList = {};	
			vm.listLength = 0;
					
			var lastScanFilter =  $filter('lastScanFilter'),
				cleaningOldDevicesInterval = undefined,
				updateListInterval = undefined;
			
			//start interval for cleaning old devices
			function startUpdateListInterval(interval) {
				if(!updateListInterval) { 
					
					updateListInterval = setInterval(function() { 
						updateListLength();
						$scope.$digest();
					}, interval);
					
				}
			};
			
			//stopt interval for cleaning old devices
			function stopUpdateListInterval() {
				if(updateListInterval) {
					clearInterval(updateListInterval);
					updateListInterval = undefined;
				}
			};
			
			//
	      	function updateListLength() {
	    		var i = 0;
	    		for (key in vm.allDevicesList) {
	    			i++; 
	    		}
	    		//used in view
	    		vm.listLength = i;
	    	};
			

			//start interval for cleaning old devices
			function startcleaningOldDevicesinterval (interval, timeago) {
				timeago = (timeago)?timeago:interval;
			
				if(!cleaningOldDevicesInterval) {
					cleaningOldDevicesInterval = $interval(function() {
						//@TODO last ScanFilter is broken
						
						var filteredDevices = lastScanFilter(vm.allDevicesList, timeago, 'scanData');
						
						// console.log('item.scanData:', JSON.stringify(filteredDevices));
						
						angular.forEach(vm.allDevicesList, function(item, key) {
							if(!filteredDevices[key]) {
								//delete vm.allDevicesList[key];
							}
						});	
						
					}, interval);
				}
			}; 
			
			//stopt interval for cleaning old devices
			function stopcleaningOldDevicesinterval() {
				if(cleaningOldDevicesInterval) {
					$interval.cancel(cleaningOldDevicesInterval);
					cleaningOldDevicesInterval = undefined;
				}
			};
			
	    	//this is used to update list after serverdata updated   	
	    	function onFoundDeviceHandler(preparedDevice) { 
	 
	    		var newDevice =  bleDeviceService.getKnownDevice(preparedDevice.bcmsBeaconKey);
	    		/*{
	    			bcmsBeaconKey	: preparedDevice.bcmsBeaconKey, 
					bcmsBeacon 		: {},
					scanData		: preparedDevice
				};*/
	    		
	    		
	    		
	    		//console.log(newDevice); 
	    		//vm.allDevicesList.push(preparedDevice);
	    		vm.allDevicesList[newDevice.bcmsBeaconKey] = newDevice;
	    		
	    		//console.log('onFoundDeviceHandler newDevice:', newDevice); 
	    		
	    		//updateListLength();
			};
			
			//receives an item with scan data, cms data and key
			function onDeviceUpdatedHandler(newDevice) {
				console.log('onDeviceUpdatedHandler newDevice: ', newDevice); 
				
				//if('bcmsBeacon' in newDevice && 'bcmsBeaconKey' in newDevice.bcmsBeacon) {
					//console.log('DASFDSF'); 
					vm.allDevicesList[newDevice.bcmsBeaconKey] = newDevice;
				//}
				
			
				updateListLength();
			}
			
	      	//initial stuff 
	      	function init() {
	      		//console.log('init bleDevicesListCtrl'); 
	      		startcleaningOldDevicesinterval(2*1000, 3000);
	      		startUpdateListInterval(1000);
	      		
	      		//bleDeviceChannel.subKnownDeviceUpdated($scope, onDeviceUpdatedHandler);
	      		
	      		bleScannerChannel.onFoundBleDevice($scope, onFoundDeviceHandler);
	      	}

	      	init();

}]);