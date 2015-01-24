/* Services */
var bleServices = angular.module('bleServices', [ 'bleFilters', 'bcmsServices', 'LocalForageModule']);

bleServices
//http://codingsmackdown.tv/blog/2013/04/29/hailing-all-frequencies-communicating-in-angularjs-with-the-pubsub-design-pattern/
.factory('bleNotificationChannel', ['$rootScope', function ($rootScope) {
    
	// private notification messages
	var _BLE_SCANNER_STATE_UPDATED_ 	= '_BLE_SCANNER_STATE_UPDATED_';
    var _FOUND_BLE_DEVICE_ 				= '_FOUND_BLE_DEVICE_';
    var _KNOWN_DEVICES_UPDATED_ 		= '_KNOWN_DEVICES_UPDATED_';
    var _DEVICES_TRIGGERED_ 			= '_DEVICES_TRIGGERED_';
    var _BLE_START_SCANN_ERROR_			= '_BLE_START_SCANN_ERROR_';

    // publish bleScannerState updated notification
    var publishBleScannerStateUpdated = function (state) {
        $rootScope.$broadcast(_BLE_SCANNER_STATE_UPDATED_, {state: state});
    };
    //subscribe to found device notification
    var onBleScannerStateUpdated = function($scope, handler) {
    	$scope.$on(_BLE_SCANNER_STATE_UPDATED_, function(event, args) {
	    handler(args.state);
	   });	
    };
    
    // publish found device notification
    var publishFoundDevice = function (rawDevice) {
        $rootScope.$broadcast(_FOUND_BLE_DEVICE_, {rawDevice: rawDevice});
    };
    //subscribe to found device notification
    var onFoundBleDevice = function($scope, handler) {
    	
    	$scope.$on(_FOUND_BLE_DEVICE_, function(event, args) {
    		handler(args.rawDevice);
	   });
    };
       
   // publish knownDevices updated notification
   // updateDate is an array of  device.address => true
   var publishKnownDevicesUpdated = function (updatedDate) {
	 
       $rootScope.$broadcast(_KNOWN_DEVICES_UPDATED_, {updatedDate: updatedDate});
   };
   // subscribe to knownDevices updated notification
   var onKnownDevicesUpdated = function ($scope, handler) {
       $scope.$on(_KNOWN_DEVICES_UPDATED_, function (event, agrs) {
    	   handler( agrs.updatedDate );
       });
   };
   
   // publish deviceTriggered  notification
   var publishDeviceTriggered = function (bcmsBeaconKey) {
       $rootScope.$broadcast(_DEVICES_TRIGGERED_, {bcmsBeaconKey: bcmsBeaconKey});
   };
   // subscribe to deviceTriggered notification
   var onDeviceTriggered = function ($scope, handler) {
       $scope.$on(_DEVICES_TRIGGERED_, function (event, agrs) {
    	   handler( agrs.bcmsBeaconKey );
       });
   };
   
   // publish bleStartScanError  notification
   var publishBleStartScanError = function () {
       $rootScope.$broadcast(_DEVICES_TRIGGERED_);
   };
   // subscribe to bleStartScanError notification
   var onBleStartScanError = function ($scope, handler) {
       $scope.$on(_DEVICES_TRIGGERED_, function (event) {
    	   handler();
       });
   };

   // return the publicly accessible methods
   return {
	   
	   publishBleStartScanError 		: publishBleStartScanError,
	   onBleStartScanError				: onBleStartScanError,
	   
	   publishBleScannerStateUpdated 	: publishBleScannerStateUpdated,
	   onBleScannerStateUpdated			: onBleScannerStateUpdated,
	   
	   publishFoundDevice				: publishFoundDevice,
	   onFoundBleDevice 				: onFoundBleDevice,
	   
	   onKnownDevicesUpdated 			: onKnownDevicesUpdated,
	   publishKnownDevicesUpdated		: publishKnownDevicesUpdated,
	   
	   publishDeviceTriggered 			: publishDeviceTriggered,
	   onDeviceTriggered 				: onDeviceTriggered,
	   
   	};
}])
   


.factory('$cordovaEvothingsBLE', [ '$q', '$filter', 'bleNotificationChannel', '$interval', '$ionicPlatform', 
                         function ( $q,   $filter,   bleNotificationChannel,   $interval,   $ionicPlatform ) {
	//TESTING START==========================================================================================================
	var interval 			= undefined;
	var intervalPromise  	= undefined;
	//NOTICE: addresses maybe not in right order 
	var foundedDeviceDummy7_1 	= {  'rssi':-90, 'address' : '0E:FA:EF:0C:22:39', 'scanRecord'	: 'AgEEGv9MAAIV5sVttd/7SNKwiED1qBSW7gAHAAGzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='};
	var foundedDeviceDummy7_2 	= {  'rssi':-90, 'address' : '0E:FA:EF:0C:22:40', 'scanRecord'	: 'AgEEGv9MAAIV5sVttd/7SNKwiED1qBSW7gAHAAK/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='};
	var foundedDeviceDummy7_3	= {  'rssi':-50, 'address' : '0E:FA:EF:0C:22:41', 'scanRecord'	: 'AgEEGv9MAAIV5sVttd/7SNKwiED1qBSW7gAHAAPFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='};
	//
	var foundedDeviceDummy143_1	= {  'address' : '0C:F3:EE:53:43:64', 'scanRecord' : 'BwlUQzE0MwAO/1oAAAAV5RgAAAAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=' };
	var foundedDeviceDummy143_2	= {  'address' : '0C:F3:EE:53:43:64', 'scanRecord' : 'BwlUQzE0MwAO/1oAAAAW2hcAAAAqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=' };
	var foundedDeviceDummy143_3	= {  'address' : '0C:F3:EE:53:43:64', 'scanRecord' : 'BwlUQzE0MwAO/1oAAAAWAxcAAAArAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=' };
	var foundedDeviceDummy143_4	= {  'address' : '0C:F3:EE:53:43:64', 'scanRecord' : 'BwlUQzE0MwAO/1oAAAAWAxcAAAAsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=' };
	var foundedDeviceDummy143_5	= {  'address' : '0C:F3:EE:53:43:64', 'scanRecord' : 'BwlUQzE0MwAO/1oAAAAWQRcAAAAtAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=' };
	var foundedDeviceDummy143_6	= {  'address' : '0C:F3:EE:53:43:64', 'scanRecord' : 'BwlUQzE0MwAO/1oAAAAWQRcAAAAuAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=' };
	var foundedDeviceDummy143_7	= {  'address' : '0C:F3:EE:53:43:64', 'scanRecord' : 'BwlUQzE0MwAO/1oAAAAWIhcAAAAvAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=' };
	var foundedDeviceDummy143_8	= {  'address' : '0C:F3:EE:53:43:64', 'scanRecord' : 'BwlUQzE0MwAO/1oAAAAW2hcAAAApAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=' };
	
	/* ScanResult{
		 mDevice=0E:FA:EF:0C:22:39, 
		 mScanRecord=ScanRecord [
		                         mAdvertiseFlags=4, 
		                         mServiceUuids=null, 
		                         mManufacturerSpecificData={76=[2, 21, -26, -59, 109, -75, -33, -5, 72, -46, -80, -120, 64, -11, -88, 20, -106, -18, 0, 7, 0, 1, -77]}, 
		                         mServiceData={}, 
		                         mTxPowerLevel=-2147483648, 
		                         mDeviceName=null
		                        ],
		                        mRssi=-59,
		                        mTimestampNanos=697368315587888
	 }*/

	var startDummyDeviceFoundLoopWith$interval = function () {
		if(!intervalPromise) intervalPromise = $interval(function() {if (toIsBrokenRawDevice(foundedDeviceDummy7_1)) { 
			//console.log('do publish found'); 
			bleNotificationChannel.publishFoundDevice(foundedDeviceDummy7_1 ); }}, 100);
	};
	
	var stopDummyDeviceFoundLoopWith$interval = function () {
		
		if(intervalPromise) {$interval.cancel(intervalPromise);intervalPromise = undefined;}
	};
	
	var startDummyDeviceFoundLoopWithSetInterval = function () {	
		if(!interval) { 
			interval = setInterval(
				function() {
						
						bleNotificationChannel.publishFoundDevice( foundedDeviceDummy7_1 ); 
						bleNotificationChannel.publishFoundDevice( foundedDeviceDummy7_2 );
						bleNotificationChannel.publishFoundDevice( foundedDeviceDummy7_3 );
						
				}
				,5000);

			//setTimeout(function() {foundedDeviceDummy7_3.rssi =-80;}, 3000);	
			//setTimeout(function() {foundedDeviceDummy7_3.rssi =-70;}, 6000);
			//setTimeout(function() {foundedDeviceDummy7_3.rssi =-60;}, 9000);
			//setTimeout(function() {foundedDeviceDummy7_3.rssi =-50;}, 12000);
			
			//setTimeout(function() {foundedDeviceDummy7_2.rssi =-80;}, 3000);	
			//setTimeout(function() {foundedDeviceDummy7_2.rssi =-70;}, 6000);
			//setTimeout(function() {foundedDeviceDummy7_2.rssi =-60;}, 9000);
			//setTimeout(function() {foundedDeviceDummy7_2.rssi =-50; clearInterval(interval);interval = undefined;}, 12000);
			//setTimeout(function() {bleNotificationChannel.publishFoundDevice( foundedDeviceDummy7_1 )}, 1000);	
			//setTimeout(function() {bleNotificationChannel.publishFoundDevice( foundedDeviceDummy7_2 )}, 1000);
			//setTimeout(function() {bleNotificationChannel.publishFoundDevice( foundedDeviceDummy7_3 )}, 2500);
			//setTimeout(function() {bleNotificationChannel.publishFoundDevice( foundedDeviceDummy143_3 )}, 1000);
	
			//setTimeout(function() {bleNotificationChannel.publishFoundDevice( foundedDeviceDummy143_1 )}, 1000);
			//setTimeout(function() {bleNotificationChannel.publishFoundDevice( foundedDeviceDummy143_2 )}, 2000);
			//setTimeout(function() {bleNotificationChannel.publishFoundDevice( foundedDeviceDummy143_3 )}, 3000);
			//setTimeout(function() {bleNotificationChannel.publishFoundDevice( foundedDeviceDummy143_4 )}, 4000);
			//setTimeout(function() {bleNotificationChannel.publishFoundDevice( foundedDeviceDummy143_5 )}, 5000);
			//setTimeout(function() {bleNotificationChannel.publishFoundDevice( foundedDeviceDummy143_6 )}, 6000);
			//setTimeout(function() {bleNotificationChannel.publishFoundDevice( foundedDeviceDummy143_7 )}, 7000);
		}	
		
	};
	var stopDummyDeviceFoundLoopWithSetInterval = function () {
		if(interval) { clearInterval(interval);interval = undefined; }
	};
	//TESTING END===================================================================================================================================
		
	//holds state of ble scanner
	var bleScannerState = false;
	
	//the toIsBrokenRawDevice filter
	var toIsBrokenRawDevice = $filter('toIsBrokenRawDevice');

	//check
	var isBleDefined = function() {
		if(typeof evothings == 'undefined'){
			return false;
		}
		return true;
	}
	
	//returns bleScannerState
	var getBleScannerState = function() {
		return bleScannerState;
	};
	
	//set bleScannerState
	var setBleScannerState = function(state) {
		bleScannerState = (state)?true:false;
		bleNotificationChannel.publishBleScannerStateUpdated(bleScannerState);
	};
	
	// sends notification that a device has been found
    var foundDevice = function(rawDevice) {
    	//console.log('do publish found'); 
        bleNotificationChannel.publishFoundDevice(rawDevice);
    };
	
	//start scanning for ble devices
	var startScanning = function() {
		
		//scip if scanner already scanns
		if(getBleScannerState()) {return;}
		
		
		
		//just for testing
		//startDummyDeviceFoundLoopWithSetInterval(); 
		if(!isBleDefined()) { return; };
		
		
		
		//start scanning
		setBleScannerState(true);	
		
		$ionicPlatform.ready(function() {
			
		evothings.ble.startScan(
			function(rawDevice) {
				//console.log('BLE startScan found device uuid: ' + rawDevice.address);
				if (toIsBrokenRawDevice(rawDevice)) { 
					//console.log('do publish found');
					bleNotificationChannel.publishFoundDevice(rawDevice);
				}
			},
			function(error) {
				//set bleScannerState to false
				setBleScannerState(false);
				bleNotificationChannel.publishBleStartScanError();
				//console.log('BLE startScanning error: ' + error);
			}
		);
		});
		
		
	};
	//start scanning for ble devices
	var stopScanning = function() {	
		
		if(!getBleScannerState()) {return;}
		setBleScannerState(false);
		
		//just for testing 
		//stopDummyDeviceFoundLoopWithSetInterval(); 
		
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

	// return the publicly accessible methods
	return {
		getBleScannerState 	: getBleScannerState,
		startScanning 		: startScanning,
		stopScanning 		: stopScanning
	 };
					
}])

/*Constants for the bleDeviceService*/
.constant( "bleDeviceServiceConfig", {
		_UNKNOWN_DEVICE_ 	: 'Unknown Device',
		
		_UNKNOWN_TYPE_ 		: 'Unknown Type',
		_I_BEACON_			: 'iBeacon',
		_ESTIMOTE_			: 'Estimote',
		
		mapTypeRawDevice	: 'scanData',
		mapTypeBcmsDevice	: 'bcmsBeacon',
		
})
   
.factory('bleDeviceService', [ '$rootScope',  'bleDeviceServiceConfig',  '$filter', 'bleNotificationChannel', 'bleCompanyIdentifierService', 'bcmsNotificationChannel',  '$localForage',       
                      function( $rootScope,    bleDeviceServiceConfig,	  $filter,   bleNotificationChannel,   bleCompanyIdentifierService,   bcmsNotificationChannel,    $localForage ){
	  //needed to use the $on method in the bleNotoficationChannel
	  //http://stackoverflow.com/questions/16477123/how-do-i-use-on-in-a-service-in-angular
	  var scope = $rootScope.$new();  // or $new(true) if you want an isolate scope

	  //list of all scanned devices [ address => device, ]
	
	  //
	  var cmsBeaconKeyToObj  = $filter('cmsBeaconKeyToObj');
	  	  	 
	  //decode scanRecond of device and extract data
	  var prepareDeviceData =  function (device) {
		  
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
			//?
			device.d1 = str.substr(14,2);
			//?
			device.d2 = str.substr(16,2);
			//This is the Universally Unique Identifier [UUID] in the Manufacture-Data (length = 32)
			device.mfUuid	= str.substr(18,32); 
			//This is the Major value
			device.major	= parseInt(str.substr(50,4), 16);
			//This is the Minor value
			device.minor	= parseInt(str.substr(54,4), 16);
			//This is out beacon address in the cms if you want to see its content (UUID.Major.Minor) 
			//device.address = device.mfUuid + '.' + device.major + '.' + device.minor;
			
			//This is the UUID as iBeacon-UUID format
			device.iBeaconUuid	= hexToIBeaconUuid(device.mfUuid);
			
			device.address = device.iBeaconUuid;
			//set lastScan to now
			device.lastScan = Date.now();
			
			//if no name is given set to default
			device.name = (device.name)?device.name:bleDeviceServiceConfig._UNKNOWN_DEVICE_;
			
			//@TODO this cvalue should came form cms
			device.trigger = -50;
			device.triggerState = true;
			
			return device;
	  };
		  
      //receaved an array of address => true
      // returns the array of knownDevices
      var getKnownDevices = function() {
    	  var requestedDevices = {};
    	  $localForage.iterate(function(value, key) {
  			if(cmsBeaconKeyToObj(key) != false) {
  				if(value.scanData && value.bcmsBeacon ) {
  					return  value;
  				}
  			};

  		}).then(function(data) {});
    	
    	return requestedDevices; 
    	 
      };
      
      //this function holds all logic for updateing and interperting data form scanner and server
      var mapBeaconDataToLocalStorage = function(deviceData, type) {
    	  type = (type)?type:false;
    	  
    	  var 	bcmsBeaconKey 	= undefined,
    	  		inTriggerRange  = false;
    
    	  if(type != false) {
	    	  //rawDeviceData
	    	  if(type == bleDeviceServiceConfig.mapTypeRawDevice) {
	    		  bcmsBeaconKey = deviceData.iBeaconUuid+'.'+deviceData.major+'.'+deviceData.minor;
	    	  } 
	    	  //bcmsData
	    	  else if (bleDeviceServiceConfig.mapTypeBcmsDevice) {
	    		  bcmsBeaconKey = deviceData.uuid+'.'+deviceData.major+'.'+deviceData.minor;
	    	  }
	      } 
    	  //no data type prefered
    	  else {
    		  //gues what it is
    		  console.log('no type given!'); 
    	  }
    	 
    	  $localForage.getItem(bcmsBeaconKey).then(
    			  function(data) {
    				  //add
    				  if(data == undefined) {
    					  data = {};
    					  data.address = bcmsBeaconKey;
    				  }
    				 
    				  //
    				  if(type == bleDeviceServiceConfig.mapTypeRawDevice) {
    					  data.scanData = deviceData;
    					
    					  if( data.scanData.rssi > -65 &&  data.bcmsBeacon) {
    						  inTriggerRange  = true;
    					  }
    		    	  } 
    				  
    		    	  //bcmsData
    		    	  else if (bleDeviceServiceConfig.mapTypeBcmsDevice) {
    		    		  data.bcmsBeacon = deviceData;
    		    	  }
    				  
    				  //
    				  $localForage.setItem(bcmsBeaconKey, data).then(
    					  function () {
    						  bleNotificationChannel.publishKnownDevicesUpdated(null);
    						  if(inTriggerRange) {
   							   	bleNotificationChannel.publishDeviceTriggered(bcmsBeaconKey);
   							   	inTriggerRange  = false;
    						  }
    				  });
    			  }
    	  );
      }
      
	  var onFoundBleDeviceHandler = function(rawDevice)  {
		  prepareDeviceData(rawDevice);
		  mapBeaconDataToLocalStorage(rawDevice, bleDeviceServiceConfig.mapTypeRawDevice); 
	  };
	  
	  var init = function() {
		  bleNotificationChannel.onFoundBleDevice(scope, onFoundBleDeviceHandler); 
	  };
      
      //do initialisation
      init();
      
      // return the publicly accessible methods
      return {
    	  getKnownDevices				: getKnownDevices,
    	  mapBeaconDataToLocalStorage	: mapBeaconDataToLocalStorage
      };
      
   }])

/*Constants for the bleDeviceService*/
.constant("bleCompanyIdentifierConfig", {
		_UNKNOWN_COMPANY_ 	: 'Unknown Company',
})
   
.factory('bleCompanyIdentifierService', [ '$http', '$filter', 'bleCompanyIdentifierConfig', 
                                  function($http,   $filter,   bleCompanyIdentifierConfig){
	 var companyIdentifiers = {};
	 var reverseMIdFilter = $filter('reverseMId');
	
	 var init = function() {
	  //list of all known companyIdentifier {hex:0x000,copmany:company name}
	  //got data from https://www.bluetooth.org/en-us/specification/assigned-numbers/company-identifiers
	 
	  	getCompanyIdentifiers();
	 }
	
		var getCompanyIdentifiers = function() {
			
		  $http({
			    method: 'GET',
			    url: 'app/data/companyIdentifier.json'
			  }).success(function(data) {
				  companyIdentifiers = data;
			  }).error(function(data) {
				  //console.log('error while loading app/data/companyIdentifier.json');
				  //console.log(data); 
			  });
	  };
	  
	  var getHex = function(companyName) {
    	  var result = undefined;
		  angular.forEach(companyIdentifiers, function(obj, i){
			 if(obj.company == companyName) {
				 result = obj.hex;
			 }	 
    	  }); 
    	  return result; 
      };
	  
      var getCompanyName = function(hex) {
    	  var result = bleCompanyIdentifierConfig._UNKNOWN_COMPANY_;
		  angular.forEach(companyIdentifiers, function(obj, i){
			 if(reverseMIdFilter(obj.hex.toString().substr(-4), true).toLowerCase() == hex) {
				 result = obj.company;
			 }	 
    	  }); 
    	  return result; 
      };
      
      var getHex = function(companyName) {
    	  var result = undefined;
		  angular.forEach(companyIdentifiers, function(obj, i){
			 if(obj.company == companyName) {
				 result = obj.hex;
			 }	 
    	  }); 
    	  return result; 
      };


      //do initialisation
      init();
      
      // return the publicly accessible methods
      return {
    	  getCompanyName			: getCompanyName,
    	  getHex					: getHex,
    	  getCompanyIdentifiers 	: getCompanyIdentifiers,
      };
      
   }]);