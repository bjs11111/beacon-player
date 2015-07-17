/* Services */
var bleScanners = angular.module('bleScanners', ['bleChannels', 'bleFilters']);


bleScanners.factory('sitBleDummyScanner', 
			[ '$q', '$filter', 'bleScannerChannel', '$interval', '$ionicPlatform', 
	function ( $q,   $filter,   bleScannerChannel,   $interval,   $ionicPlatform ) {
	
	/*
	 * scannerstate
	 **/			
	var bleScannerState = false;

	/*
	 * platforms
	 * */
	var platformTypes = [ {name : 'IOS'}, {name : 'Android'}, {name : 'Windows'} ];
	var fakePlatform = false;
	
	//the toIsBrokenRawDevice filter
	var toIsBrokenRawDevice = $filter('toIsBrokenRawDevice');
	
	var interval 			= undefined,
		intervalPromise  	= undefined;
	
	var break2s = 2000;
	
	var getFakePlatform = function () {
		return fakePlatform;
	};
	
	var setFakePlatform = function (platform) {
		for(var i = 0 in platformTypes) {
			if(platformTypes[i].name == platform) {
				fakePlatform = platformTypes[i].name;
			}
		}
	};
	
	var getPlatformTypes = function () {
		return platformTypes;
	};
	
	/*
	 * helpers
	 * */
	var randBetween = function (min, max) {
	    return Math.floor( (min < 0)?(min + Math.random() * (Math.abs(min)+max)):(min + Math.random() * max));
	}
	
	var getRawAndroidData = function(rssiRange) {
		//@TODO implement default range for RSSI 
		var dev = rawAndroidScannData[randBetween(0,rawAndroidScannData.length-1)];
		
		dev.rssi = randBetween(rssiRange.min,rssiRange.max)
		return dev;
	}
	
	var getRawIOSData = function(rssiRange, accuracyRange, proximity) {
		var dev = bcmsBeacons[randBetween(0,bcmsBeacons.length)];
		
		dev.rssi = randBetween(rssiRange.min,rssiRange.max);
		dev.accuracy = randBetween(accuracyRange.min,accuracyRange.max);
		
		(proximity >= 0 && proximity <= proximityValues.length)?proximityValues[proximity]:proximityValues[randBetween(0,proximityValues.length)];
		
		return dev;
	}
	
	/*
	 * data
	 * */
	var proximityValues = ["ProximityNear", "ProximityInermediate", "ProximityFar" ];
	
	var rawAndroidScannData = [
	        {address:'0E:FA:EF:0C:22:39', scanRecord:'AgEEGv9MAAIV5sVttd/7SNKwiED1qBSW7gAHAAGzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='},
	        {address:'0E:FA:EF:0C:22:40', scanRecord:'AgEEGv9MAAIV5sVttd/7SNKwiED1qBSW7gAHAAK/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='},
	        {address:'0E:FA:EF:0C:22:41', scanRecord:'AgEEGv9MAAIV5sVttd/7SNKwiED1qBSW7gAHAAPFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='} 
	];
	
	var rawIOSScannData = [
   	        {uuid:"E6C56DB5-DFFB-48D2-B088-40F5A81496EE", major:7, minor:1},
			{uuid:"E6C56DB5-DFFB-48D2-B088-40F5A81496EE", major:7, minor:2},
			{uuid:"E6C56DB5-DFFB-48D2-B088-40F5A81496EE", major:7, minor:3},
	];
	
	/*
	 * simulations
	 * */
	var approachRssiTo = function(device, toRssi, steps, stepDelay) {
		//defaults
		steps = (steps) ? (parseInt(steps) != NaN?parseInt(steps):1 ):1;
		stepDelay = (stepDelay) ? (parseInt(stepDelay) != NaN?parseInt(stepDelay):500 ):500;
		
		//debug
		//toRssi = 20; device.rssi = 91;
		//toRssi = 20; device.rssi = -91;
		//toRssi = -20; device.rssi = -91;
		//toRssi = -20; device.rssi = 91;
		
		var currentStep = 1,
			defer = $q.defer(),
			rssiDiff = Math.abs(device.rssi-toRssi),
			rssiStep = ~~(rssiDiff/steps)
			rssiStepMod = rssiDiff%steps,
			numSign = (toRssi-device.rssi >= 0)?1:-1;
		
		/*console.log('steps: ' + steps);
		console.log('from: ' + device.rssi);
		console.log('to: ' + toRssi);
		console.log('diff: ' + rssiDiff); 
		console.log('diffStep: ' + rssiStep); 
		console.log('rssiStepMod: ' + rssiStepMod); 
		console.log('numSign: ' + numSign);
		console.log('add*numSign: ' + rssiStep* numSign);*/
		
		
		
		$interval(function() {
			var add = (currentStep == steps)?rssiStep+rssiStepMod:rssiStep;
			
			device.rssi += add* numSign; 
			bleScannerChannel.publishFoundDevice( device );
			
			console.log('device.rssi: ' + device.rssi); 
			
			if(currentStep == steps) { defer.resolve(device); }
			currentStep++;
          }, stepDelay, steps);
		
		return defer.promise; 
	}
	
	approachRssiTo( getRawAndroidData({min:-50, max: -90}) , -110, 10, 600 ).then(
			function() {
				console.log( 'Rssi approach to ' + -70 );
			},
			function() {}
	);

	return {
		getFakePlatform 	: getFakePlatform,
		setFakePlatform 	: setFakePlatform,
		getPlatformTypes 	: getPlatformTypes,
		
		rawAndroidScannData : rawAndroidScannData,
		rawIOSScannData 	: rawIOSScannData,
		
		approachRssiTo : approachRssiTo
		
	}

}]);


bleScanners.factory('sitBleScanner', [ '$q', '$filter', 'bleScannerChannel', '$ionicPlatform', 
                             function ( $q,   $filter,   bleScannerChannel,   $ionicPlatform ) {
	
	
	//
	var bleStream = new Rx.Subject();
	
	//locationManager.Delegate()
	var delegate = undefined;
	
	//array of uuids of bcms
	var iBeaconRanges = [
		//Estimote Beacon factory UUID.
		//{ "uuid"			: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', "registered" 	: false}
	];
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
		
	var getIBeaconRanges = function() {
	  return iBeaconRanges; 
  	};
  
  	var setDelegate = function(newDelegate) {
  		delegate = newDelegate;
    };
    
    var getDelegate = function(newDelegate) {
  		return delegate;
    };
    
  	
    //add uuid to range
     var addIBeaconRange = function(uuid) {
    	 
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
	}
		  
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
    var foundDevice = function(rawDevice) {
    	//console.log('do publish found'); 
        bleScannerChannel.publishFoundDevice(rawDevice);
    };
    
  
	/*
    var startAndroidScanning = function() {
    	console.log('start');
		if(isBleDefined() == false){ return; } 
		console.log('isBleDefined');
		//skip if scanner already scanns
		if(getBleScannerState()) { return;}
		console.log('getBleScannerState');
		//@TODO check ble is on or off
		
		//start scanning
		setBleScannerState(true);	
		
		$ionicPlatform.ready(function() {
			console.log('ready');
			evothings.ble.startScan(
				function(rawDevice) {
					console.log(rawDevice);
					//console.log('BLE startScan found device uuid: ' + rawDevice.address);
					if (toIsBrokenRawDevice(rawDevice)) { 
						//console.log('do publish found');
						bleNotificationChannel.publishFoundDevice(rawDevice);
					}
				},
				function(error) {
					console.log(error);
					//set bleScannerState to false
					setBleScannerState(false);
					bleNotificationChannel.publishBleStartScanError();
					//console.log('BLE startScanning error: ' + error);
				}
			); 
		});
	};*/
    
	var watchAndroidBleScanner = function() {
		console.log(evothings.ble.startScan);
		
		return bleStream.create( function (observer) {
	    
	    	evothings.ble.startScan(
					function(rawDevice) {
						console.log(rawDevice); 
						//console.log('BLE startScan found device uuid: ' + rawDevice.address);
						if (toIsBrokenRawDevice(rawDevice)) { 
							//console.log('do publish found');
							bleScannerChannel.publishFoundDevice(rawDevice);
							observer.onNext(rawDevice);
						}
					},
					function(error) {
						console.log(error); 
						//set bleScannerState to false
						setBleScannerState(false);
						bleScannerChannel.publishBleStartScanError();
						observer.onError(error);
						//console.log('BLE startScanning error: ' + error);
					});
	    
	    	
	    }).publish().refCount();
	}
	//start scanning for ble devices on Android
	var startAndroidScanning = function() {
		
		if(isBleDefined() == false){ return; } 
		
		//skip if scanner already scanns
		if(getBleScannerState()) { return;}
		
		//@TODO check ble is on or off
		
		//start scanning
		setBleScannerState(true);	
		
		$ionicPlatform.ready(function() { 
			bleStream = watchAndroidBleScanner();			
		});
	};/**/
	
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
	
	var startScanning = function() {
		
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
	
	//start scanning for ble devices
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
	
	//start scanning for ble devices
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
		bleStream 			: bleStream,
		setDelegate			: setDelegate,
		getDelegate 		: getDelegate,
		addIBeaconRange		: addIBeaconRange,
    	getIBeaconRanges	: getIBeaconRanges,
		getBleScannerState 	: getBleScannerState,
		startScanning 		: startScanning,
		stopScanning 		: stopScanning
	 };
					
}]);