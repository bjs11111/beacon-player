var bleDevicesControllers = angular.module('bp.bleDevicesControllers', ['commons.filter.listFilters', 'commons.services.ble.bleChannels', 'deviceListDirectives', 'commons.deviceDataManager.channel', 'commons.deviceDataManager.service']);
//@TODO to implement
bleDevicesControllers.constant("BackgroundProcessConfig", {
	//refreshBeaconListInterval		: ms
	refreshBeaconListInterval 	: 1000 * 30,
	msBeforeBeaconIsOld : 1000 * 10,
});

bleDevicesControllers.controller('bleDevicesListCtrl',
				[ '$scope', '$filter','$interval','$timeout','DeviceDataManagerChannel','DeviceDataManagerService','bleScannerChannel',
         function( $scope,   $filter,  $interval, $timeout, DeviceDataManagerChannel,  DeviceDataManagerService, bleScannerChannel) {

			//var ngFilter = $filter('filter');
			//var itemInLlist = ngFilter(vm.allDevicesList, {bcmsBeaconKey: newDevice.bcmsBeaconKey})[0];
			var lastScanFilter =  $filter('lastScanFilter'),
				cleaningOldDevicesInterval = undefined,
				updateListInterval = undefined;

			var vm = this;

				vm.allDevicesList = [];
        vm.monitoredRegions = [];

				vm.listLength = 0;

			init();

			/////////////////////////////////////

			//start interval for cleaning old devices
			function startUpdateListInterval(interval) {
				if(!updateListInterval) {
					updateListInterval = setInterval(function() {
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

			//start interval for cleaning old devices
			function startcleaningOldDevicesinterval (interval, timeago) {
				timeago = (timeago)?timeago:interval;

				if(!cleaningOldDevicesInterval) {
					cleaningOldDevicesInterval = $interval(function() {
						//@TODO lastScanFilter is broken
						angular.forEach(vm.allDevicesList, function(item, key) {
							if( item.scanData.lastScan < Date.now()-timeago) {
								vm.allDevicesList.splice(key, 1);
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
			}

			//receives an item with scan data, cms data and key
			function onDeviceUpdatedHandler(newDevice) {
	    		if(newDevice.scanData.rssi && newDevice.bcmsBeacon.contentTitle) {

	    			var isNewItem = true;
	    			for (var i = 0; i < vm.allDevicesList.length; i++) {
	    		        if (vm.allDevicesList[i].bcmsBeaconKey == newDevice.bcmsBeaconKey) {
	    		        	isNewItem = false;
	    		        	vm.allDevicesList[i] = newDevice;
	    		        }
	    		    }

	    			if(isNewItem) { vm.allDevicesList.push(newDevice); }
	    			//$scope.$digest();
	    		}
			}

           function onFoundDeviceHandler(beacon){
             $timeout(function(){
               if(beacon.monitored==1) {
                 vm.monitoredRegions.push(beacon);
               }
             }, 0);
           }

	      	//initial stuff
	      	function init() {
	      		//console.log('init bleDevicesListCtrl');
	      		startcleaningOldDevicesinterval(2*1000, 3000);
	      		DeviceDataManagerChannel.subKnownDeviceUpdated($scope, onDeviceUpdatedHandler);
            bleScannerChannel.onFoundBleDevice($scope, onFoundDeviceHandler);
	      	}



}]);