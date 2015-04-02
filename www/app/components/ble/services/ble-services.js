/* Services */
var bleServices = angular.module('bleServices', [ 'bleFilters', 'bcmsServices', 'LocalForageModule']);

bleServices
/*Constants for the bleDeviceService*/
.constant( "bleNotificationChannelConfig", {
	_BLE_SCANNER_STATE_UPDATED_ 	: '_BLE_SCANNER_STATE_UPDATED_',
    _FOUND_BLE_DEVICE_ 				: '_FOUND_BLE_DEVICE_',
    _KNOWN_DEVICES_UPDATED_			: '_KNOWN_DEVICES_UPDATED_',
    _KNOWN_DEVICES_UPDATED_ 		: '_KNOWN_DEVICES_UPDATED_',
    _DEVICES_TRIGGERED_ 			: '_DEVICES_TRIGGERED_',
    _BLE_START_SCANN_ERROR_			: '_BLE_START_SCANN_ERROR_',
})

//http://codingsmackdown.tv/blog/2013/04/29/hailing-all-frequencies-communicating-in-angularjs-with-the-pubsub-design-pattern/
.factory('bleNotificationChannel', ['$rootScope', 'bleNotificationChannelConfig', function ($rootScope, bleNotificationChannelConfig) {
    
    // publish bleScannerState updated notification
    var publishBleScannerStateUpdated = function (state) {
        $rootScope.$broadcast(bleNotificationChannelConfig._BLE_SCANNER_STATE_UPDATED_, {state: state});
    };
    //subscribe to found device notification
    var onBleScannerStateUpdated = function($scope, handler) {
    	$scope.$on(bleNotificationChannelConfig._BLE_SCANNER_STATE_UPDATED_, function(event, args) {
	    handler(args.state);
	   });	
    };
    
    // publish found device notification
    var publishFoundDevice = function (rawDevice) {
        $rootScope.$broadcast(bleNotificationChannelConfig._FOUND_BLE_DEVICE_, {rawDevice: rawDevice});
    };
    //subscribe to found device notification
    var onFoundBleDevice = function($scope, handler) {
    	$scope.$on(bleNotificationChannelConfig._FOUND_BLE_DEVICE_, function(event, args) {
    		handler(args.rawDevice);
	   });
    };
    
    // publish knownDevice updated notification
    // updateDate iBeaconUuid.Majoe.Minor
    var publishKnownDeviceUpdated = function (bcmsBeaconKey) {
        $rootScope.$broadcast(bleNotificationChannelConfig._KNOWN_DEVICE_UPDATED_, {bcmsBeaconKey: bcmsBeaconKey});
    };
    // subscribe to knownDevice updated notification
    var onKnownDeviceUpdated = function ($scope, handler) {
        $scope.$on(bleNotificationChannelConfig._KNOWN_DEVICE_UPDATED_, function (event, agrs) {
     	   handler( agrs.bcmsBeaconKey );
        });
    };
       
   // publish knownDevices updated notification
   // updateDate is an array of  device.bcmsBeaconKey => true
   var publishKnownDevicesUpdated = function (updatedDate) {
       $rootScope.$broadcast(bleNotificationChannelConfig._KNOWN_DEVICES_UPDATED_, {updatedDate: updatedDate});
   };
   // subscribe to knownDevices updated notification
   var onKnownDevicesUpdated = function ($scope, handler) {
       $scope.$on(bleNotificationChannelConfig._KNOWN_DEVICES_UPDATED_, function (event, agrs) {
    	   handler( agrs.updatedDate );
       });
   };
   
   // publish deviceTriggered  notification
   var publishDeviceTriggered = function (bcmsBeaconKey) {
       $rootScope.$broadcast(bleNotificationChannelConfig._DEVICES_TRIGGERED_, {bcmsBeaconKey: bcmsBeaconKey});
   };
   // subscribe to deviceTriggered notification
   var onDeviceTriggered = function ($scope, handler) {
       $scope.$on(bleNotificationChannelConfig._DEVICES_TRIGGERED_, function (event, agrs) {
    	   handler( agrs.bcmsBeaconKey );
       });
   };
   
   // publish bleStartScanError  notification
   var publishBleStartScanError = function () {
       $rootScope.$broadcast(bleNotificationChannelConfig._DEVICES_TRIGGERED_);
   };
   // subscribe to bleStartScanError notification
   var onBleStartScanError = function ($scope, handler) {
       $scope.$on(bleNotificationChannelConfig._DEVICES_TRIGGERED_, function (event) {
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
	   
	   onKnownDeviceUpdated 			: onKnownDeviceUpdated,
	   publishKnownDeviceUpdated		: publishKnownDeviceUpdated,
	   
	   onKnownDevicesUpdated 			: onKnownDevicesUpdated,
	   publishKnownDevicesUpdated		: publishKnownDevicesUpdated,
	   
	   publishDeviceTriggered 			: publishDeviceTriggered,
	   onDeviceTriggered 				: onDeviceTriggered,
	   
   	};
}])
   

.factory('$dummyScanner', [ '$q', '$filter', 'bleNotificationChannel', '$interval', '$ionicPlatform', 
                         function ( $q,   $filter,   bleNotificationChannel,   $interval,   $ionicPlatform ) {
	
	//TESTING START==========================================================================================================
	var bleScannerState = false;

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

	//beacons of basic test user
	var iOSData7_1  = { 
				rssi : -100,
				major:7,
				minor:1,
				uuid:"E6C56DB5-DFFB-48D2-B088-40F5A81496EE",
				accuracy:1.66,
				rssi:-74,
				proximity:"ProximityNear"
	};
	var androidData7_1  = {  
		rssi		: 	-100, 
		address 	: 	'0E:FA:EF:0C:22:39', 
		scanRecord	: 	'AgEEGv9MAAIV5sVttd/7SNKwiED1qBSW7gAHAAGzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=' 
	};
	var beacon7_1 	= undefined;

	var iOSData7_2  = { 
				rssi : -100,
				major:7,
				minor:2,
				uuid:"E6C56DB5-DFFB-48D2-B088-40F5A81496EE",
				accuracy:1.66,
				rssi:-74,
				proximity:"ProximityNear" 
	};
	var androidData7_2  = {  
		rssi		:-100, 
		address 	: '0E:FA:EF:0C:22:40', 
		scanRecord	: 'AgEEGv9MAAIV5sVttd/7SNKwiED1qBSW7gAHAAK/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=' 
	};
	var beacon7_2 	= undefined

	var iOSData7_3  = { 
				rssi : -100,
				major:7,
				minor:3,
				uuid:"E6C56DB5-DFFB-48D2-B088-40F5A81496EE",
				accuracy:1.66,
				rssi:-74,
				proximity:"ProximityNear" 
	};
	var androidData7_3  = {  
		rssi		:	-100, 
		address 	: 	'0E:FA:EF:0C:22:41', 
		scanRecord	: 	'AgEEGv9MAAIV5sVttd/7SNKwiED1qBSW7gAHAAPFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=' 
	};
	var beacon7_3	= undefined;
	
	//
	var beacon2_1 	= {  'rssi':-100, 'address' : '0E:FA:EF:0C:22:24', 'scanRecord'	: 'AgEEGv9MAAIV5sVttd/7SNKwiED1qBSW7gACAAGzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='};
	var beacon2_2 	= {  'rssi':-100, 'address' : '0E:FA:EF:0C:22:25', 'scanRecord'	: 'AgEEGv9MAAIV5sVttd/7SNKwiED1qBSW7gACAAK/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='};
	var beacon2_3	= {  'rssi':-100, 'address' : '0E:FA:EF:0C:22:24', 'scanRecord'	: 'AgEEGv9MAAIV5sVttd/7SNKwiED1qBSW7gACAAPFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='};
	//
	var beacon1_3 	= {  'rssi':-100, 'address' : '0E:FA:EF:0C:22:23', 	'scanRecord' : 'AgEEGv9MAAIV5sVttd/7SNKwiED1qBSW7gABAAPFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='};
	//
	var beacon90_3373	 	= {  'rssi':-100, 'address' : '0E:F3:EE:5A:0D:2D', 	'scanRecord' : 'AgEEGv9MAAIVaZ68gOHzEeOaDwzz7jvAEgBaDS2zAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='};
	var beacon90_3380	 	= {  'rssi':-100, 'address' : '0E:F3:EE:5A:0D:34', 	'scanRecord' : 'AgEEGv9MAAIVaZ68gOHzEeOaDwzz7jvAEgBaDTSzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='};
	//estimote
	var beacon32199_23063 	= {  'rssi':-100, 'address' : 'C3:9C:5A:17:7D:C7', 	'scanRecord' : 'AgEGGv9MAAIVuUB/MPX4Rm6v+SVVa1f+bX3HWhe2CQllc3RpbW90ZQ4WChjHfRdanMO2x30XWgAAAAAAAAA='};
	
	//
	var beacon143_1	= { 'rssi':-100, 'address' : '0C:F3:EE:53:43:64', 'scanRecord' : 'BwlUQzE0MwAO/1oAAAAV5RgAAAAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='};
	var beacon143_2	= { 'rssi':-100, 'address' : '0C:F3:EE:53:43:64', 'scanRecord' : 'BwlUQzE0MwAO/1oAAAAW2hcAAAAqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='};
	var beacon143_3	= { 'rssi':-100, 'address' : '0C:F3:EE:53:43:64', 'scanRecord' : 'BwlUQzE0MwAO/1oAAAAWAxcAAAArAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='};
	var beacon143_4	= { 'rssi':-100, 'address' : '0C:F3:EE:53:43:64', 'scanRecord' : 'BwlUQzE0MwAO/1oAAAAWAxcAAAAsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='};
	var beacon143_5	= { 'rssi':-100, 'address' : '0C:F3:EE:53:43:64', 'scanRecord' : 'BwlUQzE0MwAO/1oAAAAWQRcAAAAtAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='};
	var beacon143_6	= { 'rssi':-100, 'address' : '0C:F3:EE:53:43:64', 'scanRecord' : 'BwlUQzE0MwAO/1oAAAAWQRcAAAAuAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='};
	var beacon143_7	= { 'rssi':-100, 'address' : '0C:F3:EE:53:43:64', 'scanRecord' : 'BwlUQzE0MwAO/1oAAAAWIhcAAAAvAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='};
	var beacon143_8	= { 'rssi':-100, 'address' : '0C:F3:EE:53:43:64', 'scanRecord' : 'BwlUQzE0MwAO/1oAAAAW2hcAAAApAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='};
	
	
	var nearBeaconEntersPositiveAndExit = function(delay, stepBreak) {
		delay = (delay)?delay:1000;
		stepBreak = (stepBreak)?stepBreak:break2s;
		var i = 0;
		console.log(delay, stepBreak); 
		//entry at -57dBm 
		setTimeout(function() {beacon7_1.rssi =-57; bleNotificationChannel.publishFoundDevice( beacon7_1 ); }, delay+stepBreak*i++);
		setTimeout(function() {beacon7_1.rssi =-57; bleNotificationChannel.publishFoundDevice( beacon7_1 ); }, delay+stepBreak*i++);
		//stay
		setTimeout(function() {beacon7_1.rssi =-56; bleNotificationChannel.publishFoundDevice( beacon7_1 ); }, delay+stepBreak*i++);
		setTimeout(function() {beacon7_1.rssi =-58; bleNotificationChannel.publishFoundDevice( beacon7_1 ); }, delay+stepBreak*i++);	
		setTimeout(function() {beacon7_1.rssi =-54; bleNotificationChannel.publishFoundDevice( beacon7_1 ); }, delay+stepBreak*i++);
		setTimeout(function() {beacon7_1.rssi =-60; bleNotificationChannel.publishFoundDevice( beacon7_1 ); }, delay+stepBreak*i++);
		setTimeout(function() {beacon7_1.rssi =-67; bleNotificationChannel.publishFoundDevice( beacon7_1 ); }, delay+stepBreak*i++);
		//exti at -67dBm
		setTimeout(function() {beacon7_1.rssi =-68; bleNotificationChannel.publishFoundDevice( beacon7_1 ); }, delay+stepBreak*i++);
		setTimeout(function() {beacon7_1.rssi =-58; bleNotificationChannel.publishFoundDevice( beacon7_1 ); }, delay+stepBreak*i++);
		setTimeout(function() {beacon7_1.rssi =-70; bleNotificationChannel.publishFoundDevice( beacon7_1 ); }, delay+stepBreak*i++);
		i = 0;
	}
	
	var nearBeaconEntersNagativeAndExiteOneTime = function(delay, stepBreak) {
		delay = (delay)?delay:1000;
		stepBreak = (stepBreak)?stepBreak:break2s;
		var i = 0;
		console.log(delay, stepBreak); 
		//near beacon 
		//rssiCalibration value = B3=>179
		//rssiOneMeterDistance  = -77
		setTimeout(function() {beacon7_1.rssi =-70; bleNotificationChannel.publishFoundDevice( beacon7_1 ); }, delay+stepBreak*i++);	
		setTimeout(function() {beacon7_1.rssi =-58; bleNotificationChannel.publishFoundDevice( beacon7_1 ); }, delay+stepBreak*i++);
		//entry at -57dBm 
		setTimeout(function() {beacon7_1.rssi =-57; bleNotificationChannel.publishFoundDevice( beacon7_1 ); }, delay+stepBreak*i++);
		//stay
		setTimeout(function() {beacon7_1.rssi =-56; bleNotificationChannel.publishFoundDevice( beacon7_1 ); }, delay+stepBreak*i++);
		setTimeout(function() {beacon7_1.rssi =-58; bleNotificationChannel.publishFoundDevice( beacon7_1 ); }, delay+stepBreak*i++);	
		setTimeout(function() {beacon7_1.rssi =-54; bleNotificationChannel.publishFoundDevice( beacon7_1 ); }, delay+stepBreak*i++);
		setTimeout(function() {beacon7_1.rssi =-60; bleNotificationChannel.publishFoundDevice( beacon7_1 ); }, delay+stepBreak*i++);
		setTimeout(function() {beacon7_1.rssi =-67; bleNotificationChannel.publishFoundDevice( beacon7_1 ); }, delay+stepBreak*i++);
		//exti at -67dBm
		setTimeout(function() {beacon7_1.rssi =-68; bleNotificationChannel.publishFoundDevice( beacon7_1 ); }, delay+stepBreak*i++);
		setTimeout(function() {beacon7_1.rssi =-58; bleNotificationChannel.publishFoundDevice( beacon7_1 ); }, delay+stepBreak*i++);
		setTimeout(function() {beacon7_1.rssi =-70; bleNotificationChannel.publishFoundDevice( beacon7_1 ); }, delay+stepBreak*i++);
		i = 0;
	}
	
	var intermediateBeaconEntersNagativeAndExiteOneTime = function(delay, stepBreak) {
		delay = (delay)?delay:1000;
		stepBreak = (stepBreak)?stepBreak:break2s;
		var i = 0;
		//intermediate beacon enters and exite time one
		//rssiCalibration value = BF=>191
		//rssiOneMeterDistance  = -65
		setTimeout(function() {beacon7_2.rssi =-60; bleNotificationChannel.publishFoundDevice( beacon7_2 ); },  delay+stepBreak*i++);	
		
		setTimeout(function() {beacon7_2.rssi =-56; bleNotificationChannel.publishFoundDevice( beacon7_2 ); },  delay+stepBreak*i++);
		//entrys at -55dBm 
		setTimeout(function() {beacon7_2.rssi =-55; bleNotificationChannel.publishFoundDevice( beacon7_2 ); }, delay+stepBreak*i++);
		//stays 
		setTimeout(function() {beacon7_2.rssi =-54; bleNotificationChannel.publishFoundDevice( beacon7_2 ); },  delay+stepBreak*i++)
		setTimeout(function() {beacon7_2.rssi =-50; bleNotificationChannel.publishFoundDevice( beacon7_2 ); },  delay+stepBreak*i++);	
		setTimeout(function() {beacon7_2.rssi =-60; bleNotificationChannel.publishFoundDevice( beacon7_2 ); },  delay+stepBreak*i++);
		setTimeout(function() {beacon7_2.rssi =-70; bleNotificationChannel.publishFoundDevice( beacon7_2 ); },  delay+stepBreak*i++);
		setTimeout(function() {beacon7_2.rssi =-75; bleNotificationChannel.publishFoundDevice( beacon7_2 ); },  delay+stepBreak*i++);
		//exti at -75dBm
		setTimeout(function() {beacon7_2.rssi =-76; bleNotificationChannel.publishFoundDevice( beacon7_2 ); },  delay+stepBreak*i++);
		setTimeout(function() {beacon7_2.rssi =-79; bleNotificationChannel.publishFoundDevice( beacon7_2 ); },  delay+stepBreak*i++);
		setTimeout(function() {beacon7_2.rssi =-80; bleNotificationChannel.publishFoundDevice( beacon7_2 ); },  delay+stepBreak*i++);
		i = 0;
	}
	
	var farBeaconEntersNagativeAndExiteOneTime = function(delay, stepBreak) {
		delay = (delay)?delay:0;
		stepBreak = (stepBreak)?stepBreak:break2s;
		var i = 0;
		//far beacon 
		//rssiCalibration value = C5=>197
		//rssiOneMeterDistance  = -59
		setTimeout(function() {beacon7_3.rssi =-80; bleNotificationChannel.publishFoundDevice( beacon7_3 ); }, delay+stepBreak*i++);	
		setTimeout(function() {beacon7_3.rssi =-70; bleNotificationChannel.publishFoundDevice( beacon7_3 ); }, delay+stepBreak*i++);
		//entrys at -69dBm  
		setTimeout(function() {beacon7_3.rssi =-69; bleNotificationChannel.publishFoundDevice( beacon7_3 ); }, delay+stepBreak*i++);
		//stays 
		setTimeout(function() {beacon7_3.rssi =-68; bleNotificationChannel.publishFoundDevice( beacon7_3 ); }, delay+stepBreak*i++);
		setTimeout(function() {beacon7_3.rssi =-60; bleNotificationChannel.publishFoundDevice( beacon7_3 ); }, delay+stepBreak*i++);	
		setTimeout(function() {beacon7_3.rssi =-70; bleNotificationChannel.publishFoundDevice( beacon7_3 ); }, delay+stepBreak*i++);
		setTimeout(function() {beacon7_3.rssi =-90; bleNotificationChannel.publishFoundDevice( beacon7_3 ); }, delay+stepBreak*i++);
		setTimeout(function() {beacon7_3.rssi =-99; bleNotificationChannel.publishFoundDevice( beacon7_3 ); }, delay+stepBreak*i++);
		//exti at -99dBm
		setTimeout(function() {beacon7_3.rssi =-100; bleNotificationChannel.publishFoundDevice( beacon7_3 ); }, delay+stepBreak*i++);
		setTimeout(function() {beacon7_3.rssi =-96; bleNotificationChannel.publishFoundDevice( beacon7_3 ); }, delay+stepBreak*i++);
		setTimeout(function() {beacon7_3.rssi =-100; bleNotificationChannel.publishFoundDevice( beacon7_3 ); }, delay+stepBreak*i++);
		i = 0;
	}
	
	var nearFarIntermediateBeaconEntersNagativeAndExiteAlleOneTime = function(offset, delay, stepBreak) {
		offset = (offset)?offset:0;
		delay = (delay)?delay:0;
		stepBreak = (stepBreak)?stepBreak:break2s;
		var i = 0;
		//near beacon 
		nearBeaconEntersNagativeAndExiteOneTime((offset*i++)+delay, stepBreak);					
		//intermediate beacon 
		intermediateBeaconEntersNagativeAndExiteOneTime((offset*i++)+delay, stepBreak);
		//far beacon
		farBeaconEntersNagativeAndExiteOneTime((offset*i++)+delay, stepBreak);
	}
	
	var invalidBeaconDoStuff = function (delay, stepBreak) {
		delay = (delay)?delay:0;
		stepBreak = (stepBreak)?stepBreak:break2s;
		
		
		setTimeout(function() {bleNotificationChannel.publishFoundDevice( beacon143_1 )}, 1000);
		setTimeout(function() {bleNotificationChannel.publishFoundDevice( beacon143_2 )}, 2000);
		setTimeout(function() {bleNotificationChannel.publishFoundDevice( beacon143_3 )}, 3000);
		setTimeout(function() {bleNotificationChannel.publishFoundDevice( beacon143_4 )}, 4000);
		setTimeout(function() {bleNotificationChannel.publishFoundDevice( beacon143_5 )}, 5000);
		setTimeout(function() {bleNotificationChannel.publishFoundDevice( beacon143_6 )}, 6000);
		setTimeout(function() {bleNotificationChannel.publishFoundDevice( beacon143_7 )}, 7000);
	}
	
	var startDummyDeviceFoundLoopWith$interval = function () {
		if(!intervalPromise) intervalPromise = $interval(function() {if (toIsBrokenRawDevice(beacon7_1)) { 
			//console.log('do publish found'); 
			bleNotificationChannel.publishFoundDevice(beacon7_1 ); }}, 100);
	};
	
	var stopDummyDeviceFoundLoopWith$interval = function () {
		if(intervalPromise) {$interval.cancel(intervalPromise);intervalPromise = undefined;}
	};	
	
	var randomRssi = function() {
		var M = -100,
			N = 0;
		// num is random integer from M to N
		return Math.floor(M + (1+N-M)*Math.random())   
	}
	
	var startDummyDeviceFoundLoopWithSetInterval = function () {
		
		//skip if scanner already scanns
		if(getDummyBleScannerState() == true) {
			//console.log('getBleScannerState == true'); 
			return;
		}
	
		//start scanning
		setDummyBleScannerState(true);	
		
		if(!interval) { 
			interval = setInterval(
				function() {
					
					if(fakePlatform === false) {
						if(ionic.Platform.isAndroid()) {
							beacon7_1 	= androidData7_1;
							beacon7_2 	= androidData7_2;
							beacon7_3 	= androidData7_3;
						}
						else if(ionic.Platform.isIOS()) {
							beacon7_1 	= iOSData7_1;
							beacon7_2 	= iOSData7_2;
							beacon7_3 	= iOSData7_3;
						}  
						else if(ionic.Platform.isWindowsPhone()) {
							//@TODO
						} 
					}
					else {
						if(fakePlatform === 'IOS') {
							beacon7_1 	= iOSData7_1;
							beacon7_2 	= iOSData7_2;
							beacon7_3 	= iOSData7_3;
						}
						else if (fakePlatform === 'Android') {
							beacon7_1 	= androidData7_1;
							beacon7_2 	= androidData7_2;
							beacon7_3 	= androidData7_3;
						}
						else {
							beacon7_1 	= androidData7_1;
							beacon7_2 	= androidData7_2;
							beacon7_3 	= androidData7_3;
						}
					}
					console.log(beacon7_1);
					beacon7_1.rssi = randomRssi(); bleNotificationChannel.publishFoundDevice( beacon7_1 )
					beacon7_2.rssi = randomRssi(); bleNotificationChannel.publishFoundDevice( beacon7_2 )
					beacon7_3.rssi = randomRssi(); bleNotificationChannel.publishFoundDevice( beacon7_3 )
				}
				,1000);

		}	
		
	};

	var stopDummyDeviceFoundLoopWithSetInterval = function () {
		if(interval) { clearInterval(interval); interval = undefined; 
		setDummyBleScannerState(false);	}
	};
	
	//returns bleScannerState
	var getDummyBleScannerState = function() {
		return bleScannerState;
	};
	
	//set bleScannerState
	var setDummyBleScannerState = function(state) {
		bleScannerState = (state)?true:false;
		bleNotificationChannel.publishBleScannerStateUpdated(bleScannerState);
	};

	return {
		getFakePlatform 	: getFakePlatform,
		setFakePlatform 	: setFakePlatform,
		getPlatformTypes 	: getPlatformTypes,
		
		getDummyBleScannerState: getDummyBleScannerState,
		setDummyBleScannerState: setDummyBleScannerState,
		
		startDummyDeviceFoundLoopWith$interval 		: startDummyDeviceFoundLoopWith$interval,
		stopDummyDeviceFoundLoopWith$interval 		: stopDummyDeviceFoundLoopWith$interval,
		
		startDummyDeviceFoundLoopWithSetInterval 		: startDummyDeviceFoundLoopWithSetInterval,
		stopDummyDeviceFoundLoopWithSetInterval 		: stopDummyDeviceFoundLoopWithSetInterval,
		
		invalidBeaconDoStuff : invalidBeaconDoStuff,
		
		
		nearBeaconEntersPositiveAndExit		: nearBeaconEntersPositiveAndExit,
		nearBeaconEntersNagativeAndExiteOneTime : nearBeaconEntersNagativeAndExiteOneTime,
		
		intermediateBeaconEntersNagativeAndExiteOneTime : intermediateBeaconEntersNagativeAndExiteOneTime,
		
		farBeaconEntersNagativeAndExiteOneTime : farBeaconEntersNagativeAndExiteOneTime,
		
		nearFarIntermediateBeaconEntersNagativeAndExiteAlleOneTime : nearFarIntermediateBeaconEntersNagativeAndExiteAlleOneTime,
	}
	
	//TESTING END===================================================================================================================================
		
	
}])

.factory('$cordovaEvothingsBLE', [ '$q', '$filter', 'bleNotificationChannel', '$interval', '$ionicPlatform', 
                         function ( $q,   $filter,   bleNotificationChannel,   $interval,   $ionicPlatform ) {
	
	//locationManager.Delegate()
	var delegate = undefined;
	
	//array of uuids of bcms
	var iBeaconRanges = {
		//Estimote Beacon factory UUID.
		'B9407F30-F5F8-466E-AFF9-25556B57FE6D' : true
	};
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
  
    //add uuid to range
     var addIBeaconRange = function(uuid) {
		 //
		 if( iBeaconUuidToHex(uuid) !== false ) {
	      	iBeaconRanges[uuid] = true;
	     }
	
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
	
	var startIOSScanning = function() {
		
		if(ionic.Platform.isIOS())  {
			
			$ionicPlatform.ready(function() {
				/*
				// Specify a shortcut for the location manager holding the iBeacon functions.
				window.locationManager = cordova.plugins.locationManager;
				
				if (delegate === undefined) {
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
							bleNotificationChannel.publishFoundDevice(beacon);
							 
						}
					};
					
					// Set the delegate object to use.
					locationManager.setDelegate(delegate);
					// Request permission from user to access location info.
					// This is needed on iOS 8.
					locationManager.requestAlwaysAuthorization();
					
				}
				*/
				var i = 0;
				// Start monitoring and ranging beacons.
				for (var uuid in iBeaconRanges) {
					i++; console.log(uuid); 
					/*
					var beaconRegion = new locationManager.BeaconRegion(i,uuid);
					// Start ranging.
					locationManager.startRangingBeaconsInRegion(beaconRegion)
						.fail(console.error)
						.done();
					// Start monitoring.
					// (Not used in this example, included as a reference.)
					locationManager.startMonitoringForRegion(beaconRegion)
						.fail(console.error)
						.done();
					*/
					
				}
				
				setBleScannerState(true);
				
			});
		}
		
		else {
			setBleScannerState(false);
		}
		
	
		
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
		var i = 0;
		// Stop monitoring and ranging beacons.
		for (var uuid in iBeaconRanges) {
			i++; 
			/* 
			var beaconRegion = new locationManager.BeaconRegion(i + 1,uuid);
			cordova.plugins.locationManager.stopRangingBeaconsInRegion(beaconRegion)
			.fail(console.error)
			.done();
			*/
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
		addIBeaconRange		: addIBeaconRange,
    	getIBeaconRanges	: getIBeaconRanges,
		getBleScannerState 	: getBleScannerState,
		startScanning 		: startScanning,
		stopScanning 		: stopScanning
	 };
					
}])

.constant( "bleDeviceServiceConfig", {
		
		_UNKNOWN_DEVICE_ 	: 'Unknown Device',
		
		_UNKNOWN_TYPE_ 		: 'Unknown Type',
		_I_BEACON_			: 'iBeacon',
		_ESTIMOTE_			: 'Estimote',
		
		mapTypeRawDevice	: 'scanData',
		mapTypeBcmsDevice	: 'bcmsBeacon',
		
		triggerAreas : {
			positive 		: 'Positive', 
			negative 		: 'Negative', 
			outOfRange 		: 'OutOfRange'
		},
		triggerZones: {
			//Notice Name is same as in bcmsBeaconData
			near 			: { name :	'Near',
								entryThresholdOffset 	: 20,
								exitThresholdOffset 	: 10
							  },
			intermediate 	: { name :	'Intermediate',
								entryThresholdOffset 	: 10,
								exitThresholdOffset 	: -10
							  },
			far 			: { name :	'Far',
								entryThresholdOffset 	: -10,
								exitThresholdOffset 	: -40
							  },
		},
		
})
   
.factory('bleDeviceService', [ '$rootScope',  'bleDeviceServiceConfig',  '$filter', 'bleNotificationChannel', 'bleCompanyIdentifierService', 'bcmsNotificationChannel',       
                      function( $rootScope,    bleDeviceServiceConfig,	  $filter,   bleNotificationChannel,   bleCompanyIdentifierService,   bcmsNotificationChannel ){
	  //needed to use the $on method in the bleNotoficationChannel
	  //http://stackoverflow.com/questions/16477123/how-do-i-use-on-in-a-service-in-angular
	  var scope = $rootScope.$new();  // or $new(true) if you want an isolate scope

	  //list of all scanned devices [ iBeaconUuid.Major.Minor => deviceData, ]
	  var knownDevicesList = [];
	  //
	  var bcmsBeaconKeyToObj  = $filter('bcmsBeaconKeyToObj');
	  	
	  
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
	  }
	  
	  //
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
	  }
	  
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
	  
	  var calculateActualTriggerArea = function(deviceData) {
			var ThresholdOffset = undefined;
			var willEntry = undefined;
			
			//detect willEntry value
			//will entry or stay
			if(		deviceData.scanData.lastTriggerArea === bleDeviceServiceConfig.triggerAreas.negative
				||	deviceData.scanData.lastTriggerArea === bleDeviceServiceConfig.triggerAreas.outOfRange ) 
			{ willEntry = true; }
			//will exit or stay
			else if( deviceData.scanData.lastTriggerArea === bleDeviceServiceConfig.triggerAreas.positive ) 
			{ willEntry = false; } 
			
			if(willEntry === undefined) { 
				//console.log('SCANTEST: willEntry is undefined: ' + deviceData.scanData.lastTriggerArea + '=>' + deviceData.scanData.actualTriggerArea); 
				return; 
			}
			
			switch(deviceData.bcmsBeacon.triggerZone) {
				case bleDeviceServiceConfig.triggerZones.near.name:
					ThresholdOffset = (willEntry)?bleDeviceServiceConfig.triggerZones.near.entryThresholdOffset:bleDeviceServiceConfig.triggerZones.near.exitThresholdOffset;
				break;
				case bleDeviceServiceConfig.triggerZones.intermediate.name:
					ThresholdOffset = (willEntry)?bleDeviceServiceConfig.triggerZones.intermediate.entryThresholdOffset:bleDeviceServiceConfig.triggerZones.intermediate.exitThresholdOffset;
				break;
				case bleDeviceServiceConfig.triggerZones.far.name:
					ThresholdOffset = (willEntry)?bleDeviceServiceConfig.triggerZones.far.entryThresholdOffset:bleDeviceServiceConfig.triggerZones.far.exitThresholdOffset;
				break;	
			}
			
			if(ThresholdOffset === undefined) { 
				//console.log('ThresholdOffset is undefined'); 
				return; 
			}
				
			if(deviceData.scanData.rssi >= deviceData.scanData.rssiOneMeterDistance  + ThresholdOffset) 
			{ return bleDeviceServiceConfig.triggerAreas.positive;}
			//stay
			else {return bleDeviceServiceConfig.triggerAreas.negative;}	

		};
	
      //receaved an array of address => true
      // returns the array of knownDevices
      var getKnownDevices = function() {
    	  return knownDevicesList; 
      };
      
      var getKnownDevice = function(cmsBeaconKey) {
    	  var searchedDevice = knownDevicesList[cmsBeaconKey];
    	  if(searchedDevice) { return searchedDevice; }
    	  return false; 
      };
      
      //this function holds all logic for updating and interperting data form scanner and server
      var mapBeaconDataToKnownDevices = function(deviceData, type) {
    	  type = (type)?type:false;
    	  
    	  var 	bcmsBeaconKey  = deviceData.iBeaconUuid+'.'+deviceData.major+'.'+deviceData.minor,
    	  		inTriggerRange  = false;

    	  data = knownDevicesList[bcmsBeaconKey];
    	  
    	  //update
    	  if( !data ) {
    		  data = {};
			  data.bcmsBeaconKey = bcmsBeaconKey;
    	  }   
    	  //scanData
		  if ( type == bleDeviceServiceConfig.mapTypeRawDevice ) {
			  data.scanData = deviceData;
			  knownDevicesList[bcmsBeaconKey] = data;
			  bleNotificationChannel.publishKnownDeviceUpdated(bcmsBeaconKey);
    	  } 
    	  //bcmsData
    	  else if ( bleDeviceServiceConfig.mapTypeBcmsDevice ) {
    		  data.bcmsBeacon = deviceData;
    		  knownDevicesList[bcmsBeaconKey] = data;
    	  }
      }
      
	  var onFoundBleDeviceHandler = function(rawDevice)  {
	
		  rawDevice = prepareDeviceData(rawDevice);
		  console.log(JSON.stringify(rawDevice)); 
		  //device could not be prepared
		  if(rawDevice === false) {
			  //console.log('device could not be prepared'); 
			  return;
		  }

		  mapBeaconDataToKnownDevices(rawDevice, bleDeviceServiceConfig.mapTypeRawDevice);  
	  };
	  
	  var init = function() {
		  bleNotificationChannel.onFoundBleDevice(scope, onFoundBleDeviceHandler); 
	  };
      
      //do initialisation
      init();
      
      // return the public accessible methods
      return {
    	  getKnownDevices				: getKnownDevices,
    	  getKnownDevice				: getKnownDevice,
    	  mapBeaconDataToKnownDevices	: mapBeaconDataToKnownDevices,
    	  calculateActualTriggerArea	: calculateActualTriggerArea
      };
      
   }])

/*Constants for the bleDeviceService*/
.constant("bleCompanyIdentifierConfig", {
		_UNKNOWN_COMPANY_ 	: 'Unknown Company',
})
   
.factory('bleCompanyIdentifierService', [ '$http', '$filter', 'bleCompanyIdentifierConfig', 
                                  function($http,   $filter,   bleCompanyIdentifierConfig) {
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