/* Controllers of start component */
var bleDevicesControllers = angular.module('bleDevicesControllers', ['bleChannels', 'deviceManagers', 'beaconAPIServices', 'deviceListDirectives']);
 


/* Controllers of tour component */
//______________________________________________________________________________________

var tourControllers = angular.module('tourControllers', ['bleChannels', 'deviceManagers', 'beaconAPIServices', 'deviceListDirectives']);;

/* Tour Controllers Config*/
tourControllers.constant("tourCtrlConfig", {
	
	iabOpenVibratePattern : [100, 100, 100],
	iabOpenVibrateTime : 100,

	iabDefaultSettings 		:  {
		      location		: 'no',
		      clearcache	: 'no',
		      toolbar		: 'no'
		    }
});

/* Tour Controllers */
tourControllers.controller( 'tourCtrl', [ '$scope', 'generalService', 'bleScannerChannel','beaconAPIService', 'bleScannerChannel', 'bleDeviceService',
                                  function($scope,   generalService, bleScannerChannel,  beaconAPIService,   bleScannerChannel, bleDeviceService) {
	
	
	$scope.bleDevicesCtrl = {};
	$scope.bleDevicesCtrl.allDevicesList = {};	
	$scope.bleDevicesCtrl.filteredDevicesList = {};
	
	//we need a "." in our view variables
	$scope.apiDevicesCtrl = {};
	$scope.apiDevicesCtrl.apiDevicesList = {};
	
	var secondsLastViewUpdate = 0;
	var MIN_VIEW_UPDATE_INTERVAL = 2;
	var MAX_MEASUREMENTS=15;	// Maximum Number of RSSI measurements to calculate average distance
	var MAX_TIME=5;				// Maximum Time a measurement is preserved to average Distance
	var FACTOR_PER_SECOND=0.85;	// Time weighted average factor 
	var OFFSET_PROXIMITY_NEAR=0;
	var OFFSET_PROXIMITY_INTERMEDIATE=15;
	var OFFSET_PROXIMITY_FAR=30;
	
	
	$scope.openIABWithKey = generalService.openIABWithKey;

	$scope.showDeviceList=[
		                           /* {	bcmsBeaconKey:"699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.1",
		                            	contentTitle:"Beacon1",
		                            	contentThumbnailUrl:"http://www.starnberger.at/dev-bcms/sites/default/files/styles/thumblail_cut_100_100/public/content/bild/108/108771-em-ble-beaconblebeacon.jpg?itok=MqqPjhUF",
		                            	uuid:"699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012",
		                            	major:1,
		                            	minor:1,		                            	
		                            	triggerZone:"Near",
		                            	rssi:-65,
		                            	sort:4
		                            },
		                            {	bcmsBeaconKey:"699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.1",
		                            	contentTitle:"Beacon2",
		                            	contentThumbnailUrl:"http://www.starnberger.at/dev-bcms/sites/default/files/styles/thumblail_cut_100_100/public/content/bild/108/108771-em-ble-beaconblebeacon.jpg?itok=MqqPjhUF",
		                            	uuid:"699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012",
		                            	major:1,
		                            	minor:2,		                            	
		                            	triggerZone:"Intermediate",
		                            	rssi:-65,
		                            	sort:2
		                            },
		                            {	bcmsBeaconKey:"699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.1",
		                            	contentTitle:"Beacon3",
		                            	contentThumbnailUrl:"http://www.starnberger.at/dev-bcms/sites/default/files/styles/thumblail_cut_100_100/public/content/bild/108/108771-em-ble-beaconblebeacon.jpg?itok=MqqPjhUF",
		                            	uuid:"699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012",
		                            	major:1,
		                            	minor:3,		                            	
		                            	triggerZone:"Near",
		                            	rssi:-65,
		                            	sort:3
		                            },
		                            {	bcmsBeaconKey:"699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.1",
		                            	contentTitle:"Beacon4",
		                            	contentThumbnailUrl:"http://www.starnberger.at/dev-bcms/sites/default/files/styles/thumblail_cut_100_100/public/content/bild/108/108771-em-ble-beaconblebeacon.jpg?itok=MqqPjhUF",
		                            	uuid:"699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012",
		                            	major:1,
		                            	minor:4,		                            	
		                            	triggerZone:"Near",
		                            	rssi:-65,
		                            	sort:1
		                            }*/
		];
	
	
	
	
	//TODO: Put into the Device Controler
	


  	//start refreshes serverdata every x ms
	$scope.apiDevicesCtrl.refreshServerData = function() {
		beaconAPIService.getAllBeacons()
	    	.then(
    			//success
    			function (apiDeviceList) { 
    				console.log('apiDevicesListCtrl refreshServerData' + Date.now() ); 
    				angular.forEach(apiDeviceList, function(beacon, key) {
    					$scope.apiDevicesCtrl.apiDevicesList[key] = {	bcmsBeaconKey	: key,
    																	bcmsBeacon 		: beacon
    																};
    				});	
    				
    				$scope.$broadcast('scroll.refreshComplete');  }, 
    			//error
    			function() { $scope.$broadcast('scroll.refreshComplete'); }); 
	}	
	
	
	
	
	
	
	// Filters only known Devices
	var filterKnownBeacons = function(allDevicesList){
		console.log("Filter known Devices:" + allDevicesList);
		var onlyKnownDevicesList = {};
		
		// Filter Only known Devices
		for (var key in allDevicesList) { 
			var tmpDevice= $scope.apiDevicesCtrl.apiDevicesList[key];
			if(tmpDevice){
				console.log("Beacon Found! ");
				onlyKnownDevicesList[key]=tmpDevice;
			}
		}
		
		return onlyKnownDevicesList;
	}
	
	
	var updateIonicView = function(filteredDevicesList){
		var tmpDeviceList=[];
		
		for(var key in filteredDevicesList){
			
			var deviceToAdd ={
					bcmsBeaconKey:filteredDevicesList[key].bcmsBeaconKey,
			    	contentTitle:filteredDevicesList[key].bcmsBeacon.contentTitle,
			    	contentThumbnailUrl:filteredDevicesList[key].bcmsBeacon.contentThumbnailUrl,
			    	uuid:filteredDevicesList[key].bcmsBeacon.iBeaconUuid,
			    	major:filteredDevicesList[key].bcmsBeacon.major,
			    	minor:filteredDevicesList[key].bcmsBeacon.minor,		                            	
			    	triggerZone:filteredDevicesList[key].bcmsBeacon.triggerZone,
			    	rssi:$scope.bleDevicesCtrl.allDevicesList[key].rssi,
			    	sort:filteredDevicesList[key].sort
			};
			tmpDeviceList.push(deviceToAdd);
		}
		
		
		
		
    	
    	$scope.showDeviceList=tmpDeviceList;
		
	}
	
	
	// Filters only known Devices
	var filterWhitelistBeacons = function(filteredDevicesList){
		console.log("Filter Whitelist:" + filteredDevicesList);
		
		var whitelistDevicesList = {};
		var whitelistBeacons = {};
		
		// Look if there are Whitelist Beacons and remember the user ids
		for (var key in filteredDevicesList) { 
			//TODO: universalize key format. Somewhere it is with "-" and sometimes without.
			var tmpDevice = $scope.apiDevicesCtrl.apiDevicesList[key];
			console.log(tmpDevice);
			if(tmpDevice.bcmsBeacon.whitelisted==1){
				whitelistBeacons[key]=tmpDevice;
			}
		}
		
		// Only add Beacons that have the same user id as the whitelist beacons
		for(var key in filteredDevicesList){
			var tmpDevice = $scope.apiDevicesCtrl.apiDevicesList[key];
			
			if(Object.keys(whitelistBeacons).length==0){
				whitelistDevicesList[key]=tmpDevice; // If no Whitelist beacon is in the area, add it anyways to list
			}
			else{
				for(var key2 in whitelistBeacons){
					if(whitelistBeacons[key2].bcmsBeacon.userId==tmpDevice.bcmsBeacon.userId)
						whitelistDevicesList[key]=tmpDevice;
				}
			}
			
		}
		
		
		return whitelistDevicesList;
	}
	
	var calculateDistance = function(filteredDevicesList){
		for (var key in filteredDevicesList) { 
			
			filteredDevicesList[key].sort = $scope.bleDevicesCtrl.allDevicesList[key].rssi * $scope.bleDevicesCtrl.allDevicesList[key].rssi;
			
		}
		return filteredDevicesList;
	}
	
	
	
	
	//this is used to update list after serverdata updated   	
	var onFoundDeviceHandler = function(preparedDevice)  {
		console.log('bleDevicesListCtrl onFoundDeviceHandler' + Date.now()); 
		
		// Put Device into Array
		$scope.bleDevicesCtrl.allDevicesList[preparedDevice.bcmsBeaconKey] 	= preparedDevice;
		$scope.bleDevicesCtrl.filteredDevicesList = {};
		
		// Filter Devices that are in BCMS
		$scope.bleDevicesCtrl.filteredDevicesList = filterKnownBeacons($scope.bleDevicesCtrl.allDevicesList);
		
		// Filter Devices that with Whitelist Beacons
		$scope.bleDevicesCtrl.filteredDevicesList = filterWhitelistBeacons($scope.bleDevicesCtrl.filteredDevicesList);
		
		// Calculate Distance Beacons <--> Phone
		
		$scope.bleDevicesCtrl.filteredDevicesList = calculateDistance($scope.bleDevicesCtrl.filteredDevicesList);
		
		// Update Ionic View Array
		updateIonicView($scope.bleDevicesCtrl.filteredDevicesList);
		
		if(secondsLastViewUpdate + MIN_VIEW_UPDATE_INTERVAL < new Date().getTime() / 1000)
		{
			secondsLastViewUpdate = new Date().getTime() / 1000;
			$scope.$apply();
		}
		
	};
	
	
	// Start Scanning
		
	
	// Register for Updates when Beacons are scanned
		bleScannerChannel.onFoundBleDevice($scope, onFoundDeviceHandler );
		

		
	// Get Updates from Bluetooth Scan
	
	

}]);