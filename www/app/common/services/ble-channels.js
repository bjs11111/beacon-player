/* Services */
var bleChannels = angular.module('bleChannels', []);

/*Events for the channel*/
bleChannels.constant( "bleScannerChannelConfig", {
	_BLE_SCANNER_STATE_UPDATED_ 	: '_BLE_SCANNER_STATE_UPDATED_',
    _FOUND_BLE_DEVICE_ 				: '_FOUND_BLE_DEVICE_',
    _KNOWN_DEVICES_UPDATED_			: '_KNOWN_DEVICES_UPDATED_',
    _KNOWN_DEVICES_UPDATED_ 		: '_KNOWN_DEVICES_UPDATED_',
    _DEVICES_TRIGGERED_ 			: '_DEVICES_TRIGGERED_',
    _BLE_START_SCANN_ERROR_			: '_BLE_START_SCANN_ERROR_',
});

bleChannels.factory('bleScannerChannel', ['$rootScope', 'bleScannerChannelConfig', 
                                 function ($rootScope,   bleScannerChannelConfig) {
    //private functions
	var _subscribe = function(event, $scope, scopeHandler, argsHandler) {
		//subscribe with rotscope to event and cache unsubscribe function
		var unsubscopeHandler = $rootScope.$on(event, function(event, args) {
			scopeHandler(argsHandler(args));
		 });
		 
		//unsubscribe rootRcope listener after scope destruction
		$scope.$on('$destroy', function() {
			unsubscopeHandler();
		});
	};
	
	var _publish = function(event, args) {
		 $rootScope.$emit(event, args);
	};
	
	//public functions
	
	
	
    // publish bleScannerState updated notification
    var publishBleScannerStateUpdated = function (state) {
    	_publish(bleScannerChannelConfig._BLE_SCANNER_STATE_UPDATED_, {state: state});
    };
    //subscribe to found device notification
    var onBleScannerStateUpdated = function($scope, scopescopeHandler) {
    	_subscribe(bleScannerChannelConfig._BLE_SCANNER_STATE_UPDATED_, $scope, scopescopeHandler, function(args) { return args.state; });
    };
   
  
    
    // publish found device notification
    var publishFoundDevice = function (rawDevice) {
        _publish(bleScannerChannelConfig._FOUND_BLE_DEVICE_, {rawDevice: rawDevice});
    };
    //subscribe to found device notification
    var onFoundBleDevice = function($scope, scopeHandler) {
    	_subscribe(bleScannerChannelConfig._FOUND_BLE_DEVICE_, $scope, scopeHandler, function(args) { return args.rawDevice; });
    };
  
    
    /*!!!
    // publish knownDevice updated notification
    // updateDate iBeaconUuid.Majoe.Minor
    var publishKnownDeviceUpdated = function (bcmsBeaconKey) {
        _publish(bleScannerChannelConfig._KNOWN_DEVICE_UPDATED_, {bcmsBeaconKey: bcmsBeaconKey});
    };
    // subscribe to knownDevice updated notification
    var onKnownDeviceUpdated = function ($scope, scopeHandler) {
        _subscribe(bleScannerChannelConfig._KNOWN_DEVICE_UPDATED_,$scope, scopeHandler, function (args) { return args.bcmsBeaconKey; });
    };
    */
    
    /*!!! 
   // publish knownDevices updated notification
   // updateDate is an array of  device.bcmsBeaconKey => true
   var publishKnownDevicesUpdated = function (updatedDate) {
       _publish(bleScannerChannelConfig._KNOWN_DEVICES_UPDATED_, {updatedDate: updatedDate});
   };
   // subscribe to knownDevices updated notification
   var onKnownDevicesUpdated = function ($scope, scopeHandler) {
       _subscribe(bleScannerChannelConfig._KNOWN_DEVICES_UPDATED_, $scope, scopeHandler, function (args) {return args.updatedDate; });
   };
   */
   
   
    /*!!!
   // publish deviceTriggered  notification
   var publishDeviceTriggered = function (bcmsBeaconKey) {
       _publish(bleScannerChannelConfig._DEVICES_TRIGGERED_, {bcmsBeaconKey: bcmsBeaconKey});
   };
   // subscribe to deviceTriggered notification
   var onDeviceTriggered = function ($scope, scopeHandler) {
       _subscribe(bleScannerChannelConfig._DEVICES_TRIGGERED_, $scope, scopeHandler, function (args) {return args.bcmsBeaconKey; });
   };
   */
   
   
   //@TODO check if needed
   // publish bleStartScanError  notification
   var publishBleStartScanError = function () {
       _publish(bleScannerChannelConfig._BLE_START_SCANN_ERROR_);
   };
   // subscribe to bleStartScanError notification
   var onBleStartScanError = function ($scope, scopeHandler) {
       _subscribe(bleScannerChannelConfig._BLE_START_SCANN_ERROR_, $scope, scopeHandler, function (args) { return args });
   };
   
   
   
   // return the publicly accessible methods
   return {
	   	   
	   publishBleScannerStateUpdated 	: publishBleScannerStateUpdated,
	   onBleScannerStateUpdated			: onBleScannerStateUpdated,
	   
	   publishFoundDevice				: publishFoundDevice,
	   onFoundBleDevice 				: onFoundBleDevice,
	   
	   //!!!onKnownDeviceUpdated 			: onKnownDeviceUpdated,
	   //!!!publishKnownDeviceUpdated		: publishKnownDeviceUpdated,
	   
	   //!!!onKnownDevicesUpdated 			: onKnownDevicesUpdated,
	   //!!!publishKnownDevicesUpdated		: publishKnownDevicesUpdated,
	   
	   //!!! publishDeviceTriggered 			: publishDeviceTriggered,
	   //!!! onDeviceTriggered 				: onDeviceTriggered,
	   
	   publishBleStartScanError 		: publishBleStartScanError,
	   onBleStartScanError				: onBleStartScanError
	   
   	};
}]);
   