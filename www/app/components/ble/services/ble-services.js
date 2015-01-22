/* Services */
var bleServices = angular.module('bleServices', [ 'bleFilters', 'bcmsServices', 'LocalForageModule']);

bleServices
//http://codingsmackdown.tv/blog/2013/04/29/hailing-all-frequencies-communicating-in-angularjs-with-the-pubsub-design-pattern/
.factory('bleNotificationChannel', ['$rootScope', function ($rootScope) {
    // private notification messages
	var _BLE_SCANNER_STATE_UPDATED_ 	= '_BLE_SCANNER_STATE_UPDATED_';
    var _FOUND_BLE_DEVICE_ 				= '_FOUND_BLE_DEVICE_';
    var _KNOWN_DEVICES_UPDATED_ 		= '_KNOWN_DEVICES_UPDATED_';

    // publish bleScannerState updated notification
    var publishBleScannerStateUpdated = function (state) {
    	//console.log('in publish bleScannerState updated: ' + state );
        $rootScope.$broadcast(_BLE_SCANNER_STATE_UPDATED_, {state: state});
    };
    
    //subscribe to found device notification
    var onBleScannerStateUpdated = function($scope, handler) {
    	//console.log('in on bleScannerState updated: ' + JSON.stringify(args) );
    	$scope.$on(_BLE_SCANNER_STATE_UPDATED_, function(event, args) {
	    handler(args.state);
	   });	
    };
    
    // publish found device notification
    var publishFoundDevice = function (rawDevice) {
    	//console.log('in publish found' + JSON.stringify(rawDevice) );
        $rootScope.$broadcast(_FOUND_BLE_DEVICE_, {rawDevice: rawDevice});
    };

    //subscribe to found device notification
    var onFoundBleDevice = function($scope, handler) {
    	$scope.$on(_FOUND_BLE_DEVICE_, function(event, args) {
    		//console.log('in on foundBleDevice:' + JSON.stringify(args) );
    		handler(args.rawDevice);
	   });
       	
    };
       
   // publish knownDevices updated notification
   // updateDate is an array of  device.address => true
   var publishKnownDevicesUpdated = function (updatedDate) {
	   //console.log('in publish knownDevices updated' );
       $rootScope.$broadcast(_KNOWN_DEVICES_UPDATED_, {updatedDate: updatedDate});
   };
   // subscribe to knownDevices updated notification
   var onKnownDevicesUpdated = function ($scope, handler) {
       $scope.$on(_KNOWN_DEVICES_UPDATED_, function (event, agrs) {
    	   //console.log('in on onKnownDevicesUpdated:' + JSON.stringify(args) );
    	   handler( agrs.updatedDate );
       });
   };
       
   // return the publicly accessible methods
   return {
	   publishBleScannerStateUpdated : publishBleScannerStateUpdated,
	   onBleScannerStateUpdated: onBleScannerStateUpdated,
	   publishFoundDevice: publishFoundDevice,
	   onFoundBleDevice : onFoundBleDevice,
	   publishKnownDevicesUpdated: publishKnownDevicesUpdated,
	   onKnownDevicesUpdated: onKnownDevicesUpdated
   	};
}])
   


.factory('$cordovaEvothingsBLE', [ '$q', '$filter', 'bleNotificationChannel', '$interval', '$ionicPlatform', 
                         function ( $q,   $filter,   bleNotificationChannel,   $interval, $ionicPlatform ) {
	//TESTING START
	var interval 			= undefined;
	var intervalPromise  	= undefined;
	//NOTICE: addresses maybe not in right order 
	var foundedDeviceDummy7_1 	= {  'rssi':-50, 'address' : '0E:FA:EF:0C:22:39', 'scanRecord'	: 'AgEEGv9MAAIV5sVttd/7SNKwiED1qBSW7gAHAAGzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='};
	var foundedDeviceDummy7_2 	= {  'rssi':-60, 'address' : '0E:FA:EF:0C:22:40', 'scanRecord'	: 'AgEEGv9MAAIV5sVttd/7SNKwiED1qBSW7gAHAAK/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='};
	var foundedDeviceDummy7_3	= {  'rssi':-70, 'address' : '0E:FA:EF:0C:22:41', 'scanRecord'	: 'AgEEGv9MAAIV5sVttd/7SNKwiED1qBSW7gAHAAPFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='};
	//
	var foundedDeviceDummy143_1	= {  'address' : '0C:F3:EE:53:43:64', 'scanRecord'	: 'BwlUQzE0MwAO/1oAAAAV5RgAAAAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='};
	var foundedDeviceDummy143_2	= {  'address' : '0C:F3:EE:53:43:64', 'scanRecord'	: 'BwlUQzE0MwAO/1oAAAAW2hcAAAAqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='};
	var foundedDeviceDummy143_3	= {  'address' : '0C:F3:EE:53:43:64', 'scanRecord'	: 'BwlUQzE0MwAO/1oAAAAWAxcAAAArAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='};
	var foundedDeviceDummy143_4	= {  'address' : '0C:F3:EE:53:43:64', 'scanRecord'	: 'BwlUQzE0MwAO/1oAAAAWAxcAAAAsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='};
	var foundedDeviceDummy143_5	= {  'address' : '0C:F3:EE:53:43:64', 'scanRecord'	: 'BwlUQzE0MwAO/1oAAAAWQRcAAAAtAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='};
	var foundedDeviceDummy143_6	= {  'address' : '0C:F3:EE:53:43:64', 'scanRecord'	: 'BwlUQzE0MwAO/1oAAAAWQRcAAAAuAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='};
	var foundedDeviceDummy143_7	= {  'address' : '0C:F3:EE:53:43:64', 'scanRecord'	: 'BwlUQzE0MwAO/1oAAAAWIhcAAAAvAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='};
	var foundedDeviceDummy143_8	= {  'address' : '0C:F3:EE:53:43:64', 'scanRecord'	: 'BwlUQzE0MwAO/1oAAAAW2hcAAAApAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='};
	
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
							
			}
		,1000);
			setTimeout(function() {bleNotificationChannel.publishFoundDevice( foundedDeviceDummy7_1 )}, 1000);	
			setTimeout(function() {bleNotificationChannel.publishFoundDevice( foundedDeviceDummy7_2 )}, 1000);
			setTimeout(function() {bleNotificationChannel.publishFoundDevice( foundedDeviceDummy143_3 )}, 1000);
	
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
	//TESTING END
	
	
	//holds state of ble scanner
	var bleScannerState = false;
	
	//the toIsBrokenRawDevice filter
	var toIsBrokenRawDevice = $filter('toIsBrokenRawDevice');

	//check
	var isBleDefined = function() {
		if(typeof evothings == 'undefined'){
			console.log('ble is not defined'); 
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
		
		if(getBleScannerState()) {
			return;
		}
		//set bleScannerState to true
		setBleScannerState(true);
	
		//just for testing
		startDummyDeviceFoundLoopWithSetInterval(); 
		
		//start scanning
		setBleScannerState(true);	
		
		if(!isBleDefined()) { return; };
		
		$ionicPlatform.ready(function() {
		evothings.ble.startScan(
			function(rawDevice) {
				//console.log('BLE startScan found device uuid: ' + rawDevice.address);
				if (toIsBrokenRawDevice(rawDevice)) { 
					//console.log('do publish found');
					console.log(rawDevice.scanRecord); 
					bleNotificationChannel.publishFoundDevice(rawDevice)
				}
			},
			function(error) {
			//set bleScannerState to false
			setBleScannerState(false);
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
		stopDummyDeviceFoundLoopWithSetInterval(); 
		
		
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
		
})
   
.factory('bleDeviceService', [ '$rootScope',  'bleDeviceServiceConfig',  '$filter', 'bleNotificationChannel', 'bleCompanyIdentifierService', 'bcmsNotificationChannel', 'bcmsAjaxService', '$localForage',       
                      function( $rootScope,    bleDeviceServiceConfig,	  $filter,   bleNotificationChannel,   bleCompanyIdentifierService,   bcmsNotificationChannel,   bcmsAjaxService,   $localForage ){
	  //needed to use the $on method in the bleNotoficationChannel
	  //http://stackoverflow.com/questions/16477123/how-do-i-use-on-in-a-service-in-angular
	  var scope = $rootScope.$new();  // or $new(true) if you want an isolate scope

	  //list of all scanned devices [ address => device, ]
	  var knownDevices = {};
	
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
	  
	 	    	  	  
      // removes the device from the array and sends a notification that knownDevices has been updated
      /*var removeFormKnownDevices = function(device) {
    	  var updatedDate = [];
          for(var i = 0; i < knownDevices.length; i++) {
              if(knownDevices[device.address]) {
            	  knownDevices.splice(i, 1);
            	  updatedDate[device.address] = true;
                  bleNotificationChannel.publishKnownDevicesUpdated(updatedDate);
                  return;
              }
          };
      };*/

	// returns a specific device with the given address
      var getKnownDevice = function(addressvalue) {
    	  	var device = undefined;
    	  	angular.forEach(knownDevices, function(obj, i){
    	  		if(obj.address == addressvalue) {
    	  			device = obj;
                }
    	  	})
    	  		
            return device;
      };
	  
      //receaved an array of address => true
      // returns the array of knownDevices
      var getKnownDevices = function(addresses) {
    	   
    	  var requestedDevices = [];
    	  //@TODO overwork and think this!!!
    	  //check if json
    	  addresses = (addresses)?addresses:undefined;
    	  if(addresses === undefined) {
    		  requestedDevices = knownDevices;
    	  } else {
    		  //filter updatedDevices
    		  angular.forEach(addresses, function(obj, i){
    			  var updatedDevice = getKnownDevice(obj.address);
    			  if(updatedDevice !== undefined) {
    				  requestedDevices.push(updatedDevice);
    			  }
        	  }); 
    	  }

    	  return requestedDevices; 
      };
      
      var mapScannedDevicesWithRegisteredDevices = function() {
    	  //@TODO hold all device depending data in one list and make sub sets of data (cms, scanner)
      }
      
      var updateBleDevice = function (preparedDevice) {
    	  
  		  knownDevices[preparedDevice.address].scanData = angular.extend({}, knownDevices[preparedDevice.address].scanData, preparedDevice);
  		  
  		  updatedDate.push( {'address' : preparedDevice.address} );
  		  bleNotificationChannel.publishKnownDevicesUpdated(updatedDate);
      };
      
      var addBleDevice = function (device) {
    	  //var updatedDate = [];
    	  
    	  //detect device CompanyIdentifier
    	  device.typeName = bleCompanyIdentifierService.getCompanyName(device.mfId);
    	  
    	  var newdevice = { 'address' : device.address, 
		  					//@TODO remove testin vars and implement logic
    			  			'scanData' : device
		  		};
    	  
    	  knownDevices[device.address] = newdevice;
    	  
    	  //updatedDate.push({'address' : device.address});
    	  bleNotificationChannel.publishKnownDevicesUpdated([{'address' : newdevice.address}]);  	  
      };
      
      
	  var onBeaconListUpdatedHandler = function()  {
			bcmsAjaxService.getBeaconList().then(function(data) {
				mapScannedDevicesWithRegisteredDevices(data); 
	        });
	  };
      
      var tryAppendBleDeviceToKnownDevices = function (preparedDevice) {
    	//console.log('tryAppendBleDeviceToKnownDevices'); 
		//add device
    	  
		if( knownDevices[preparedDevice.address] ) { addBleDevice(preparedDevice); } 
	    //update    
		else { updateBleDevice(preparedDevice); }
		
	  }
      
	  var onFoundBleDeviceHandler = function(rawDevice)  {
		  //console.log('in on foundBleDevice handler'); 
		  prepareDeviceData(rawDevice);
		  var isNewDevice = true;
		  
		  //$localForage.clear();
		  
		  $localForage.iterate( function(value, key) {
				if( cmsBeaconKeyToObj(key) != false ) {
					if(key === rawDevice.iBeaconUuid+'.'+rawDevice.major+'.'+rawDevice.minor) {
						value.scanData = rawDevice;
						value.address =  rawDevice.iBeaconUuid, 
						$localForage.setItem( key, value );
						isNewDevice = false;
					} 
				};
		  });
		  
		  if(isNewDevice) {
			  $localForage.setItem( rawDevice.iBeaconUuid+'.'+rawDevice.major+'.'+rawDevice.minor, rawDevice );
		  }
		  
		  
		  //tryAppendBleDeviceToKnownDevices(rawDevice); 
	  };
	  
	  var init = function() {
		  
		  bleNotificationChannel.onFoundBleDevice(scope, onFoundBleDeviceHandler); 
		  
		  bcmsNotificationChannel.onBeaconListUpdated(scope, onBeaconListUpdatedHandler);
		  
	  };
      
      //do initialisation
      init();
      
      // return the publicly accessible methods
      return {
    	  getKnownDevices			: getKnownDevices,
    	  getKnownDevice			: getKnownDevice,
    	  tryAppendBleDevice 		: tryAppendBleDeviceToKnownDevices,
    	  //removeFormKnownDevices	: removeFormKnownDevices
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
				  console.log('error while loading app/data/companyIdentifier.json');
				  console.log(data); 
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