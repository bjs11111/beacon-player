/* Controllers of tour component */
//______________________________________________________________________________________

var tourControllers = angular.module('tourControllers', ['bleChannels', 'beaconAPIServices', 'deviceListDirectives']);;

/* Tour Controllers Config*/
tourControllers.constant("tourCtrlConfig", {
	//
	MIN_VIEW_UPDATE_INTERVAL : 2,
	MAX_MEASUREMENTS:20,	// Maximum Number of RSSI measurements to calculate average distance
	MAX_TIME:6,				// Maximum Time a measurement is preserved to average Distance
	FACTOR_PER_SECOND:0.95,	// Time weighted average factor 
	
	//
	OFFSET_PROXIMITY_NEAR:0,
	OFFSET_PROXIMITY_INTERMEDIATE:15,
	OFFSET_PROXIMITY_FAR:30,
});

/* Tour Controllers */
tourControllers.controller( 'tourCtrl', 
		['$scope', '$filter', 'tourCtrlConfig', 'generalService', 'bleScannerChannel','serverBeaconStore', 'beaconAPIChannel', 'bleScannerChannel', 'serverBeaconList' ,
function( $scope,   $filter,   tourCtrlConfig,   generalService,   bleScannerChannel,  serverBeaconStore,   beaconAPIChannel,   bleScannerChannel,   serverBeaconList ) {
	
	var secondsLastViewUpdate = 0;
	var knownBeaconsFilter = $filter('knownBeaconsFilter');
	var whitelistBeaconsFilter = $filter('whitelistBeaconsFilter');
	var lastScanFilter =  $filter('lastScanFilter');
	
	//values
	$scope.tourCtrlData = {};
	$scope.tourCtrlData.allDevicesList = {};	
	$scope.tourCtrlData.apiDevicesList = {};
	$scope.tourCtrlData.filteredDevicesList = {};
	$scope.tourCtrlData.showDeviceList = {};
	$scope.tourCtrlData.rssiMeasurements = {};
	
	angular.forEach(serverBeaconList, function(beacon, key) {
		$scope.tourCtrlData.apiDevicesList[key] = {	bcmsBeaconKey	: key,
														bcmsBeacon 		: beacon
													};
	});	
	
	

	//TODO: Put into the Device Controler
	
  	//start refreshes serverdata every x ms
	$scope.tourCtrlData.refreshServerData = function() {
		serverBeaconStore.updateBeaconList()
	    	.then(
    			//success
    			function (apiDeviceList) { 
    				
    				angular.forEach(apiDeviceList, function(beacon, key) {
    					$scope.tourCtrlData.apiDevicesList[key] = {	bcmsBeaconKey	: key,
    																	bcmsBeacon 		: beacon
    																};
    				});	
    				
    				$scope.$broadcast('scroll.refreshComplete');  }, 
    			//error
    			function() { $scope.$broadcast('scroll.refreshComplete'); }); 
	}	
	
	
	
	var _subBeaconsUpdatedHandler = function(result) {
		console.log('init result', result); 
		var newDevice = {};
		serverBeaconStore.getAllBeacons().then(
				//success
    			function (newBeaconList) { 
    				console.log('init newBeaconList', newBeaconList); 
    				angular.forEach(newBeaconList, function(beacon, key) {
    					$scope.tourCtrlData.apiDevicesList[key] = {	bcmsBeaconKey	: key,
    																bcmsBeacon 		: beacon
    															  };
    				});	
    			}, 
    			//error
    			function() { }
		);
	};
	

	var updateIonicView = function(filteredDevicesList){
		var tmpDeviceList=[];
		var count=0;
		
		for(var key in filteredDevicesList){
			
			var deviceToAdd = {
					bcmsBeaconKey:filteredDevicesList[key].bcmsBeaconKey,
			    	contentTitle:filteredDevicesList[key].bcmsBeacon.contentTitle,
			    	contentThumbnailUrl:filteredDevicesList[key].bcmsBeacon.contentThumbnailUrl,
			    	uuid:filteredDevicesList[key].bcmsBeacon.iBeaconUuid,
			    	major:filteredDevicesList[key].bcmsBeacon.major,
			    	minor:filteredDevicesList[key].bcmsBeacon.minor,		                            	
			    	triggerZone:filteredDevicesList[key].bcmsBeacon.triggerZone,
			    	rssi:$scope.tourCtrlData.allDevicesList[key].rssi,
			    	sort:filteredDevicesList[key].sort
			};
			
			
			if(Date.now() - $scope.tourCtrlData.allDevicesList[key].lastScan <= 30000) {
				tmpDeviceList.push(deviceToAdd);
			}
	
		}
    	
    	$scope.tourCtrlData.showDeviceList=tmpDeviceList;
    	
    	$scope.tourCtrlData.showDeviceList.sort(function(a, b) {
		    return a.sort - b.sort;
		});
		
	}

	//TODO: Implement detailed Distance estimation
	var calculateDistance = function(filteredDevicesList){
		for (var key in filteredDevicesList) { 
			
			
			// Calculate Sort Value: Time Weighted Average
			var distance=0;
			var weighted=0;
			for(var measurement=$scope.tourCtrlData.rssiMeasurements[key].rssi.length-1;measurement>=0;measurement--){
					var weight=Math.pow(tourCtrlConfig.FACTOR_PER_SECOND,(new Date().getTime() - $scope.tourCtrlData.rssiMeasurements[key].time[measurement])/1000);
					distance+=$scope.tourCtrlData.rssiMeasurements[key].rssi[measurement]*weight;
					weighted+=weight;
			}
			distance/=weighted;
			
			filteredDevicesList[key].sort=1000/distance;
		}
		
		return filteredDevicesList;
		
	} 
	
	
	//start interval for cleaning old devices
	var alreadyUpdatedInInterval=false;
	var updateListInterval=0;
	var startUpdateInterval = function (interval) {
		if(!updateListInterval) {		
			
			updateListInterval = setInterval(function(){ 
				updateView();
			}, interval);
			
		}
	};
	
	

	var saveRssiMeasurement = function(device){
		var d = new Date();
		if($scope.tourCtrlData.rssiMeasurements[device.bcmsBeaconKey]==null) 
		$scope.tourCtrlData.rssiMeasurements[device.bcmsBeaconKey]={};
		if($scope.tourCtrlData.rssiMeasurements[device.bcmsBeaconKey].time==null)
			$scope.tourCtrlData.rssiMeasurements[device.bcmsBeaconKey].time=[];
		
		if($scope.tourCtrlData.rssiMeasurements[device.bcmsBeaconKey].rssi==null)
			$scope.tourCtrlData.rssiMeasurements[device.bcmsBeaconKey].rssi=[];
		
		$scope.tourCtrlData.rssiMeasurements[device.bcmsBeaconKey].time.splice(0, 0, d.getTime());

		$scope.tourCtrlData.rssiMeasurements[device.bcmsBeaconKey].rssi.splice(0, 0, device.rssi);
		
		// Remove Measurements that are already too old
		for(var measurement=$scope.tourCtrlData.rssiMeasurements[device.bcmsBeaconKey].rssi.length-1;measurement>=0;measurement--){
			if($scope.tourCtrlData.rssiMeasurements[device.bcmsBeaconKey].time[measurement] + tourCtrlConfig.MAX_TIME * 1000 < new Date().getTime())
				{
					$scope.tourCtrlData.rssiMeasurements[device.bcmsBeaconKey].rssi.splice(measurement, 1);	// Remove Entry because it is too old
					$scope.tourCtrlData.rssiMeasurements[device.bcmsBeaconKey].time.splice(measurement, 1);	// Remove Entry because it is too old
				}
			else
				break;		// go out of for loop as the other values are all newer
		}
		
	} 
	
	var removeOldMeasurements = function(){ }
	
	
	
	// Get Updates from Bluetooth Scan 	
	var onFoundDeviceHandler = function(preparedDevice)  {
 
		// Put Device into Array
		$scope.tourCtrlData.allDevicesList[preparedDevice.bcmsBeaconKey] 	= preparedDevice;
		
		// Filter Devices that are in BCMS
		$scope.tourCtrlData.filteredDevicesList = {};
		$scope.tourCtrlData.filteredDevicesList = knownBeaconsFilter($scope.tourCtrlData.allDevicesList, $scope.tourCtrlData.apiDevicesList);
		
		// Save the RSSI value for the beacons that are known
		if($scope.tourCtrlData.filteredDevicesList[preparedDevice.bcmsBeaconKey]!=null)
			saveRssiMeasurement(preparedDevice);
		
		
		
	};
	
	
	var updateView = function(){
		
		
		// Filter Devices that with Whitelist Beacons
		$scope.tourCtrlData.filteredDevicesList = whitelistBeaconsFilter($scope.tourCtrlData.filteredDevicesList,  $scope.tourCtrlData.apiDevicesList);
		
		
		// Calculate Distance Beacons <--> Phone
		$scope.tourCtrlData.filteredDevicesList = calculateDistance($scope.tourCtrlData.filteredDevicesList);
		
		// Update Ionic View Array
		updateIonicView($scope.tourCtrlData.filteredDevicesList);
		
		//if(secondsLastViewUpdate + tourCtrlConfig.MIN_VIEW_UPDATE_INTERVAL < new Date().getTime() / 1000) 
		{
			secondsLastViewUpdate = new Date().getTime() / 1000;
			$scope.$digest();
		}
	};
	

	
	// Start Scanning
		//TODO: Automatically start scanner here
	
	//TODO: Retreive All Beacon List from Server
	var init = function() {
		console.log('init tourControllers');
		
		// Register for Updates when Beacons are scanned
		bleScannerChannel.onFoundBleDevice($scope, onFoundDeviceHandler );
		beaconAPIChannel.subBeaconsUpdated($scope, _subBeaconsUpdatedHandler); 
		
		
		startUpdateInterval(1000);
	}
	
	init();
	

}]);