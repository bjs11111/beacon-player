/* Services */
var bleScanners = angular.module('bleScanners', ['bleChannels', 'bleFilters']);


bleScanners.factory('sitBleScanner', [ '$q', '$filter', 'bleScannerChannel', '$interval', '$ionicPlatform', 
                             function ( $q,   $filter,   bleScannerChannel,   $interval,   $ionicPlatform ) {
	
	//locationManager.Delegate()
	var delegate = undefined;
	
	//array of uuids of bcms
	/*!!!var iBeaconRanges = [
		//Estimote Beacon factory UUID.
		//{ "uuid"			: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', "registered" 	: false}
	];*/
	//filter returns false if invalif iiud
	var iBeaconUuidToHex 	= $filter('iBeaconUuidToHex');
	
	//holds state of ble scanner
	var bleScannerState = false;
	
	//the toIsBrokenRawDevice filter
	var toIsBrokenRawDevice = $filter('toIsBrokenRawDevice');

	//check
	var isBleDefined = function() {
		//this means you have to load the cordova plugin into your project
		//or you are debugging on desctop
		if(typeof evothings == 'undefined') {
			return false;
		}
		return true;
	}
		
	/*!!!var getIBeaconRanges = function() {
	  return iBeaconRanges; 
  	};*/
  
  	var setDelegate = function(newDelegate) {
  		delegate = newDelegate;
    };
    
    var getDelegate = function(newDelegate) {
  		return delegate;
    };
    
  	
    //add uuid to range
    /*!!!var addIBeaconRange = function(uuid) {
    	 
    	var isInList = false;
		 //
		 if( iBeaconUuidToHex(uuid) !== false ) {
			 
			 for (var i in iBeaconRanges) {
				 if(iBeaconRanges[i].uuid == uuid) {
					 isInList = true
				 }
	    	 }
			 
			 if(isInList === false) {
					 iBeaconRanges.push({'uuid' : uuid, registered : false});
			 }
	     }
	}*/
		  
	//returns bleScannerState
	var getBleScannerState = function() {
		return bleScannerState;
	};
	
	//set bleScannerState
	var setBleScannerState = function(newState) {
		//be shure that newState is boolean
		newState = (newState)?true:false;
		
		//apply only if newState is different from current state
		if(newState != getBleScannerState()) {
			bleScannerState = newState;
			bleScannerChannel.publishBleScannerStateUpdated(bleScannerState);
		}
	};
	
	// sends notification that a device has been found
    /*!!! var foundDevice = function(rawDevice) {
    	//console.log('do publish found'); 
        bleScannerChannel.publishFoundDevice(rawDevice);
    };*/
    
	//start scanning for ble devices on Android
	var startAndroidScanning = function() {
		if(isBleDefined() == false){ return; } 
		
		//skip if scanner already scanns
		if(getBleScannerState()) { return;}
		
		//@TODO check ble is on or off
		
		//start scanning
		setBleScannerState(true);	
		
		$ionicPlatform.ready(function() {
			evothings.ble.startScan(
				function(rawDevice) {
					//console.log('BLE startScan found device uuid: ' + rawDevice.address);
					if (toIsBrokenRawDevice(rawDevice)) { 
						//console.log('do publish found');
						bleScannerChannel.publishFoundDevice(rawDevice);
					}
				},
				function(error) {
					//set bleScannerState to false
					setBleScannerState(false);
					bleScannerChannel.publishBleStartScanError();
					//console.log('BLE startScanning error: ' + error);
				}
			);
		});
	};
	
	
	//start scanning for ble devices on iOS
	var startIOSScanning = function() {
		$ionicPlatform.ready(function() {
			// Specify a shortcut for the location manager holding the iBeacon functions.
			window.locationManager = cordova.plugins.locationManager;
			
			// The delegate object holds the iBeacon callback functions
			// specified below.
			
			delegate = new locationManager.Delegate();
		
			// Called continuously when ranging beacons.
			delegate.didRangeBeaconsInRegion = function(pluginResult)
			{
				
				
				for (var i in pluginResult.beacons)
				{
					// Insert beacon into table of found beacons.
					var beacon = pluginResult.beacons[i];
					//beacon.timeStamp = Date.now();
					//var key = beacon.uuid + ':' + beacon.major + ':' + beacon.minor;
					//beacon.
					bleScannerChannel.publishFoundDevice(beacon);
					 
				}
			};
			
			// Set the delegate object to use.
			locationManager.setDelegate(delegate);
			
			var systemVersion = ionic.Platform.version();
            var versionArray = systemVersion.toString().split('.');
            if( parseInt(versionArray[0]) >= 8 ) {
                // Request permission from user to access location info.
                // This is needed on iOS 8.
                locationManager.requestAlwaysAuthorization();
            } 
			
			
			// Start monitoring and ranging beacons.
			for (var i in iBeaconRanges)
			{
				var beaconRegion = new locationManager.BeaconRegion(i + 1,iBeaconRanges[i].uuid);
				// Start ranging.
				locationManager.startRangingBeaconsInRegion(beaconRegion)
					.fail(console.error)
					.done();
				// Start monitoring.
				// (Not used in this example, included as a reference.)
				locationManager.startMonitoringForRegion(beaconRegion)
				.fail(console.error)
				.done();
				
				iBeaconRanges[i].registered = true;
			}
			
			setBleScannerState(true);
			
		});
		
	};
	
	// Start scanning
	var startScanning = function() {
		
		setBleScannerState(!getBleScannerState());
		return;
		//IOS
		if(ionic.Platform.isIOS()) {
			startIOSScanning();
		}
		//Android
		else if(ionic.Platform.isAndroid()) {
			startAndroidScanning();
		}
		//WindowsPhone
		else if(ionic.Platform.isWindowsPhone()) {
			//@TODO
		}
	}
	
	//stop scanning for ble devices Android specific
	var stopAndroidScanning = function() {	
		if(isBleDefined() == false){ return; } 
		
		if(!getBleScannerState()) {return;}
		setBleScannerState(false);

		if(!isBleDefined()) { return; };
			evothings.ble.stopScan(
				function(result) {
					//set bleScannerState to false
					setBleScannerState(false);
				}, 
				function(error) {
					//do nothing
					//console.log('BLE stopScanning error: ' + error);
				}
			);
	};
	
	//stop scanning for ble devices iOS specific
	var stopIOSScanning = function() {	
		setBleScannerState(false);	
		
		for (var i in iBeaconRanges)
		{
			
			var beaconRegion = new locationManager.BeaconRegion(i + 1,iBeaconRanges[i].uuid);
			cordova.plugins.locationManager.stopRangingBeaconsInRegion(beaconRegion)
			.fail(console.error)
			.done();
			
			iBeaconRanges[i].registered = false;
		}
		
	};
	
	//stop scanning
	var stopScanning = function() {
		//IOS
		if(ionic.Platform.isIOS()) {
			stopIOSScanning();
		}
		//Android
		else if(ionic.Platform.isAndroid()) {
			stopAndroidScanning();
		}
		//WindowsPhone
		else if(ionic.Platform.isWindowsPhone()) {
			//@TODO
		}
	}
	
	// return the publicly accessible methods
	return {
		setDelegate			: setDelegate,
		getDelegate 		: getDelegate,
		//!!!addIBeaconRange		: addIBeaconRange,
		//!!!getIBeaconRanges	: getIBeaconRanges,
		getBleScannerState 	: getBleScannerState,
		startScanning 		: startScanning,
		stopScanning 		: stopScanning
	 };
					
}]);