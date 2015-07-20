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
	
	
	$scope.openIABWithKey = generalService.openIABWithKey;

	$scope.showDeviceList=[
		                            {	bcmsBeaconKey:"699EBC80-E1F3-11E3-9A0F-0CF3EE3BC012.1.1",
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
		                            }
		];
	
	
	
	var filterKnownBeacons = function(allDevicesList){
		console.log("Filter known Devices:" + allDevicesList);
		for (var key in allDevicesList) { 
			if(bleDeviceService.getKnownDevice(key)){
				console.log("Beacon Found! ");
			}
		}
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
		
		
		// Calculate Distance Beacons <--> Phone
		
		
		// Update Ionic View Array
		
		
		//$scope.$apply();
		
	};
	
	
	// Start Scanning
		
	
	// Register for Updates when Beacons are scanned
		bleScannerChannel.onFoundBleDevice($scope, onFoundDeviceHandler );
		

		
	// Get Updates from Bluetooth Scan
		

	
	
	
	
	
	$scope.bleDevicesCtrl = {};
	$scope.bleDevicesCtrl.allDevicesList = {};
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

}]);