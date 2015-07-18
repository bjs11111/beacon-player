/* Services */
var beaconAPIServices = angular.module('beaconAPIServices',
		[ 'generalServices' ]);

// Constants for the bleDeviceService
// rename to general settings
beaconAPIServices.constant("beaconAPIServiceConfig", {
	getAllBeaconsPath		: 'get-all-beacons',
	
	
	// Events
	_BEACON_LIST_UPDATED_ 	: '_BEACON_LIST_UPDATED_',
	_TRY_IAB_OPEN_EVENT_ 	: '_TRY_IAB_OPEN_EVENT_',
	getAllBeaconsSuccess 	: 'getAllBeaconsSuccess',
	getAllBeaconsError 		: 'getAllBeaconsError',
});

//beaconAPIChannel 
beaconAPIServices.factory('beaconAPIChannel', 
		['$rootScope', 'beaconAPIServiceConfig',
function ($rootScope,   beaconAPIServiceConfig) {
   
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
			
   // publish knownDevices updated notification
   // updateDate is an array of  device.address => true
   var pubGetAllBeaconsSuccess = function (list) {
	   console.log('pubGetAllBeaconsSuccess' + Date.now(), list);
	   _publish(beaconAPIServiceConfig.getAllBeaconsSuccess, {list : list});
   };
   // subscribe to knownDevices updated notification
   var subGetAllBeaconsSuccess = function ($scope, scopeHandler) {
	   console.log('subGetAllBeaconsSuccess' + Date.now());
	   _subscribe(beaconAPIServiceConfig.getAllBeaconsSuccess, $scope, scopeHandler, function(args) { return args.list; });
   };
   
   // return the publicly accessible methods
   return {
	   pubGetAllBeaconsSuccess	: pubGetAllBeaconsSuccess,
	   subGetAllBeaconsSuccess	: subGetAllBeaconsSuccess
   	};
}])


// ajax calls
beaconAPIServices.factory('beaconAPIService', [
	'$http',
	'$q',
	'beaconAPIServiceConfig',
	'generalServiceConfig',
	'beaconAPIChannel',
	function($http, $q, beaconAPIServiceConfig, generalServiceConfig, beaconAPIChannel) {
		
		//$cordovaEvothingsBLE.addIBeaconRange(value.iBeaconUuid);
		//bleDeviceService.mapBeaconDataToKnownDevices(value,bleDeviceServiceConfig.mapTypeBcmsDevice);
		var getAllBeacons = function(){
			
				var retrievePath = generalServiceConfig.basePath+ '/'+ beaconAPIServiceConfig.getAllBeaconsPath,
					defer = $q.defer(),
					requestConfig = {
					method :'GET',
					url : retrievePath
				};

				$http(requestConfig)
				.success(function(data, status, headers, config){
					beaconAPIChannel.pubGetAllBeaconsSuccess(data);
					defer.resolve(data);
				})
				.error(function(data, status, headers, config){
					beaconAPIChannel.pubGetAllBeaconsSuccess(data);
					defer.reject(data);
				});
				
				return defer.promise;
		};
				
		return {
			getAllBeacons : getAllBeacons,
		};
	
	} ]);