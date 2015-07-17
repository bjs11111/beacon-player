/* Services */
var bleScanners = angular.module('bleScanners', ['bleChannels', 'bleFilters']);

bleScanners.factory('androidBleScanner', [ '$q',  '$ionicPlatform', 
                                 function ( $q,    $ionicPlatform ) {
	
	//start scanning for ble devices on Android
	var startScanning = function(foundDeviceCallback) {
		var defer = $q.defer();
			
		$ionicPlatform.ready(function() {
			evothings.ble.startScan(
				function(rawDevice) {		
					foundDeviceCallback(rawDevice);
				},
				function(error) { defer.reject(error); }
			);
			
			defer.resolve(true);
		});
		
		return defer.promise;
		
	};
	
	//start scanning for ble devices
	var stopScanning = function() {	
		var defer = $q.defer();
		
		evothings.ble.stopScan(
			function(result) { defer.resolve(true); }, 
			function(error) { defer.reject(error); }
		);
		defer.resolve(true);
		
		return defer.promise;
	};
	
	
	// return the publicly accessible methods
	return {
		startScanning 		: startScanning,
		stopScanning 		: stopScanning
	 };
			
	
}]);


bleScanners.factory('iosBleScanner', [ 'bleScannerChannel', '$filter', '$ionicPlatform', 
                             function ( bleScannerChannel,   $filter,   $ionicPlatform ) {
          	
	//locationManager.Delegate()
	var delegate = undefined;
	
	//array of uuids of bcms
	var iBeaconRanges = [
		//Estimote Beacon factory UUID.
		//{ "uuid"			: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D', "registered" 	: false}
	];
	
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

	//start scanning for ble devices on IOS
	var startScanning = function() {
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
	
	
	//start scanning for ble devices on IOS
	var stopScanning = function() {	
		if(isBleDefined() == false){ return; } 
		
		if(!getBleScannerState()) {return;}
		sitBleScanner.setBleScannerState(false);
	
		if(!isBleDefined()) { return; };
			evothings.ble.stopScan(
				function(result) {
					//set bleScannerState to false
					sitBleScanner.setBleScannerState(false);
				}, 
				function(error) {
					//do nothing
					//console.log('BLE stopScanning error: ' + error);
				}
			);
	};
	
	// return the publicly accessible methods
	return {
		setDelegate			: setDelegate,
		getDelegate 		: getDelegate,
		addIBeaconRange		: addIBeaconRange,
    	getIBeaconRanges	: getIBeaconRanges,
		startScanning 		: startScanning,
		stopScanning 		: stopScanning
	 };		
  	
}]);

bleScanners.factory('sitBleScanner', [  '$filter', 'bleScannerChannel', 'androidBleScanner', 'iosBleScanner',
                             function (  $filter,   bleScannerChannel,   androidBleScanner,   iosBleScanner ) {
	
           	//holds state of ble scanner
           	var bleScannerState = false;
           	
   
           	//filter returns false if invalif iiud
           	var iBeaconUuidToHex 	= $filter('iBeaconUuidToHex');
           	//the toIsBrokenRawDevice filter
           	var toIsBrokenRawDevice = $filter('toIsBrokenRawDevice');
           		  
           	
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
			   console.log('BLE: foundDevice ', rawDevice); 
               bleScannerChannel.publishFoundDevice(rawDevice);
            };
               
           	var startScanning = function() {
           		
           		if(getBleScannerState()) {return;}
           		
           		//IOS
           		if(ionic.Platform.isIOS()) {
           			setBleScannerState(iosBleScanner.startScanning());
           		}
           		//Android
           		else if(ionic.Platform.isAndroid()) {
           			androidBleScanner.startScanning(foundDevice)
           				.then(
           					function(result) {
           						setBleScannerState(true);
           					},
           					function(error) {
           						//@TODO should we react on this???
           					}
           				); 
           		}
           		//WindowsPhone
           		else if(ionic.Platform.isWindowsPhone()) {
           			//@TODO implement windows scanning
           		}
           	}
           	
           	
           	var stopScanning = function() {
           		
           		if(!getBleScannerState()) {return;}
           		
           		//IOS
           		if(ionic.Platform.isIOS()) {
           			setBleScannerState(iosBleScanner.stopScanning());
           		}
           		//Android
           		else if(ionic.Platform.isAndroid()) {
           			androidBleScanner.stopScanning().then(
           					function(result) {
           						setBleScannerState(false);	
           					},
           					function(error) {
           						//@TODO should we react on this?
           					}
           			);
           		}
           		//WindowsPhone
           		else if(ionic.Platform.isWindowsPhone()) {
           			//@TODO
           		}
           	};
           	
          //device should have following keya after prepare
      	  //major	
      	  //minor
      	  //rssiOneMeterDistance
      	  //rssi
      	  //iBeaconUUid
      	  //bcmsBeaconKey = uuid+'.'+major+'.'+minor;
      	  //lastScan
      	  //name
      	  var prepareDeviceData =  function (device) {
      			//IOS
      			if(ionic.Platform.isIOS()) {
      				console.log('ios'); 
      				return prepareIOSDeviceData(device);
      				
      			}
      			//Android
      			else if(ionic.Platform.isAndroid()) {
      				console.log('android'); 
      				return prepareAndroidDeviceData(device);
      			}
      			//WindowsPhone
      			else if(ionic.Platform.isWindowsPhone()) {
      				//@TODO
      				console.log('windows'); 
      			}
      	};
      	
      	var prepareIOSDeviceData =  function (device) {
      		  
      		  //This is the Major value
      			device.major	= device.major;
      			//This is the Minor value
      			device.minor	= device.minor;
      			
      			device.rssiOneMeterDistance  = -56;
      			
      			//device.rssi = device.rssi;
      			
      			device.iBeaconUuid	= device.uuid;
      			
      			device.bcmsBeaconKey = device.uuid+'.'+device.major+'.'+device.minor;
      			//set lastScan to now
      			device.lastScan = Date.now();
      			
      			//if no name is given set to default
      			device.name = bleDeviceServiceConfig._UNKNOWN_DEVICE_;

      			return device;
      	};
      	  

       	//decode scanRecond of device and extract data
       	//returns false or the device
       	var prepareAndroidDeviceData =  function (device) {
       		  
       			 var hexToIBeaconUuid 	= $filter('hexToIBeaconUuid'),
       			 	 base64DecToArr 	= $filter('base64DecToArr'),
       			 				 	 
       				 srArr = base64DecToArr(device.scanRecord),
       				 str = '';

       			str = Array.prototype.map.call(srArr, function(n) {
       					var s = n.toString(16);
       					if(s.length == 1) {s = '0'+s;}
       					return s;
       				}).join('');
       				
       			//This sequence says the first block of ad data is two octets long 
       			device.firstBlockLenght = str.substr(0,2);
       			//This says the advertising octet(s) following are Bluetooth flags 
       			device.bleFlags = str.substr(2,2);
       			//This is the binary value derived when certain of those flags are set. 
       			device.binValFlags = str.substr(4,2);
       			//This sequence says the second block of ad data is 26 octets long 
       			device.secondBlockLenght = str.substr(6,2);
       			//This identifies the group as manufacturer-specific data 
       			device.secondBlockIdentifier = str.substr(8,2);
       			//Bluetooth manufacturer ID (Apple has c400)
       			device.mfId	= str.substr(10,4);	
       			//Byte 0 of iBeacon advertisement indicator
       			device.b0 = str.substr(14,2);
       			//Byte 1 of iBeacon advertisement indicator
       			device.b1 = str.substr(16,2);
       		
       			//check iBeacon advertisement indicator
       			if( device.b0 != '02' || device.b1 != '15' ) { return false; }
       			
       			//This is the Universally Unique Identifier [UUID] in the Manufacture-Data (length = 32)
       			device.mfUuid	= str.substr(18,32); 
       			//This is the Major value
       			device.major	= parseInt(str.substr(50,4), 16);
       			//This is the Minor value
       			device.minor	= parseInt(str.substr(54,4), 16);
       			//This is out beacon address in the cms if you want to see its content (UUID.Major.Minor) 
       			//device.address = device.mfUuid + '.' + device.major + '.' + device.minor;
       			
       			//This is the RSSI value measured in 1m distancece from the iBeacon and is used for calibration the distance estimation. 
       			//signet integer 8 bit
       			device.calibrationValue = parseInt(str.substr(58,2), 16);
       			//
       			device.rssiOneMeterDistance  = device.calibrationValue - 256;
       			//This is the UUID as iBeacon-UUID format
       			device.iBeaconUuid	= hexToIBeaconUuid(device.mfUuid);
       			
       			device.bcmsBeaconKey = device.iBeaconUuid+'.'+device.major+'.'+device.minor;
       			//set lastScan to now
       			device.lastScan = Date.now();
       			
       			//if no name is given set to default
       			device.name = (device.name)?device.name:bleDeviceServiceConfig._UNKNOWN_DEVICE_;
       			//console.log('log record for dummy data: ' + device.major+'.'+device.minor + '= '+device.scanRecord+' '+device.address);
       					
       			return device;
       	};
      	
           	
           	// return the publicly accessible methods
           	return {
           		getBleScannerState 	: getBleScannerState,
           		startScanning 		: startScanning,
           		stopScanning 		: stopScanning
           	 };
           					
}]);

