/* Services */
var deviceStates = angular.module('deviceStates', []);

deviceStates.constant("deviceStatesConfig", {
	// Event Names
	networkOnline 					: '$cordovaNetwork:online',
	networkOffline 					: '$cordovaNetwork:offline',
	networkStateUpdated 			: '$cordovaNetwork:networkStateUpdated',
	bluetoothEnabledStateUpdated 	: 'diagnostic:bluetoothEnabledStateUpdated',
});

// 
deviceStates.factory('deviceStatesChannel', 
		['$rootScope', 'deviceStatesConfig',
function ($rootScope,   deviceStatesConfig) {
   
	//private functions
	var _subscribe = function(event, $scope, scopeHandler, mapArgs) {
		//subscribe with rotscope to event and cache unsubscribe function
		var unsubscopeHandler = $rootScope.$on(event, function(event, args) {
			scopeHandler(mapArgs(args));
		 });
		 
		//unsubscribe rootRcope listener after scope destruction
		$scope.$on('$destroy', function() {
			unsubscopeHandler();
		});
	};
	var _publish = function(event, args) {
		 $rootScope.$emit(event, args);
	};
	
   //
   var pubNetworkOnline = function (newState) {
	   _publish(deviceStatesConfig.networkOnline, {newState : newState});
   };
   var subNetworkOnline = function ($scope, scopeHandler) {
	   _subscribe(deviceStatesConfig.networkOnline, $scope, scopeHandler, function(args) { return args.newState; });
   };
   
   var pubNetworkOffline = function (newState) {
	   _publish(deviceStatesConfig.networkOffline, {newState : newState});
   };
   var subNetworkOffline = function ($scope, scopeHandler) {
	   _subscribe(deviceStatesConfig.networkOffline, $scope, scopeHandler, function(args) { return args.newState; });
   };
   
   var pubNetworkStateUpdated = function (newState) {
	   _publish(deviceStatesConfig.bluetoothStateUpdated, {newState : newState});
   };
   var subNetworkStateUpdated = function ($scope, scopeHandler) {
	   _subscribe(deviceStatesConfig.bluetoothStateUpdated, $scope, scopeHandler, function(args) { return args.newState; });
   };
   //
   var pubBluetoothEnabledStateUpdated = function (newState) {
	   _publish(deviceStatesConfig.bluetoothStateUpdated, {newState : newState});
   };
   var subBluetoothEnabledStateUpdated = function ($scope, scopeHandler) {
	   _subscribe(deviceStatesConfig.bluetoothStateUpdated, $scope, scopeHandler, function(args) { return args.newState; });
   };
  
   return {
	   pubNetworkOnline		: pubNetworkOnline,
	   subNetworkOnline		: subNetworkOnline,
	   pubNetworkOffline	: pubNetworkOffline,
	   subNetworkOffline	: subNetworkOffline,
	   //
	   pubBluetoothEnabledStateUpdated : pubBluetoothEnabledStateUpdated,
	   subBluetoothEnabledStateUpdated : subBluetoothEnabledStateUpdated
   	};
   	
}]);


deviceStates.factory('deviceStatesService', 
		['deviceStatesChannel', '$ionicPlatform',
 function(deviceStatesChannel,   $ionicPlatform) {

    	    var bluetoothEnabledState = false;
    	    var locationEnabledState = false;
    	    var cameraEnabledState = false;
    	    var wifiEnabledState = false;
    	   
			//Bluetooth
			var getBluetoothEnabledState = function() {
				return bluetoothEnabledState;
			};
			
			var checkBluetoothEnabledState = function() {
				$ionicPlatform.ready(function() {
					 cordova.plugins.diagnostic.isBluetoothEnabled(
					    function(enabled){
					    	deviceStatesChannel.pubBluetoothEnabledStateUpdated(enabled);
					    	bluetoothEnabledState = enabled;
					        console.log("Bluetooth is "  + (enabled ? "enabled" : "disabled"));
					    }, 
					    function(error){
					        //console.error("The following error occurred: "+error );
					    });
				});
				
			};
			
			var startAutoCheckBluetooth = function() {
				checkBluetoothEnabledState();
			}
			//Location
			var getLocationEnabledState = function() {
				return locationEnabledState;
			};
			 
    	    var isLocationEnabledSetting = function() {}
    	    
			var isLocationAuthorized = function() {}
			 
			var switchToLocationSettings = function() {}   	    
			
			//Camera
			var getCameraEnabledState = function() {
				return cameraEnabledState;
			};
			//Wifi
			var getWifiEnabledState = function() {
				return wifiEnabledState;
			};
			
			return {
				getBluetoothEnabledState : getBluetoothEnabledState,
				//getLocationEnabledState : getLocationEnabledState,
				//getCameraEnabledState : getCameraEnabledState,
				//getWifiEnabledState : getWifiEnabledState,
			};

}]);