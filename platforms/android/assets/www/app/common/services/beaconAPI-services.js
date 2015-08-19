/* Services */
var beaconAPIServices = angular.module('beaconAPIServices',
		[ 'generalServices', 'bleFilters' ]);

// Constants for the bleDeviceService
// rename to general settings
beaconAPIServices.constant("beaconAPIServiceConfig", {
	//paths
	getAllBeaconsPath		: 'get-all-beacons',
	//events
	getAllBeaconsSuccess 	: 'getAllBeaconsSuccess',
	getAllBeaconsError 		: 'getAllBeaconsError',
	uuidAdded 				: 'uuidAdded',
	beaconUpdated			: 'beaconUpdated',
	beaconsUpdated			: 'beaconsUpdated'
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
	   _publish(beaconAPIServiceConfig.getAllBeaconsSuccess, {list : list});
   };
   // subscribe to knownDevices updated notification
   var subGetAllBeaconsSuccess = function ($scope, scopeHandler) {
	   _subscribe(beaconAPIServiceConfig.getAllBeaconsSuccess, $scope, scopeHandler, function(args) { return args.list; });
   };
   
   // publish knownDevices updated notification
   // updateDate is an array of  device.address => true
   var pubGetAllBeaconsError = function (list) {
	   _publish(beaconAPIServiceConfig.getAllBeaconsError, {list : list});
   };
   // subscribe to knownDevices updated notification
   var subGetAllBeaconsError = function ($scope, scopeHandler) {
	   _subscribe(beaconAPIServiceConfig.getAllBeaconsError, $scope, scopeHandler, function(args) { return args.list; });
   };
   
   // publish uuid added notification
   var pubUuidAdded = function (uuid) {
	   _publish(beaconAPIServiceConfig.uuidAdded, {uuid : uuid});
   };
   // subscribe to uuid added notification
   var subUuidAdded = function ($scope, scopeHandler) {
	   _subscribe(beaconAPIServiceConfig.uuidAdded, $scope, scopeHandler, function(args) { return args.uuid; });
   };
   
   // publish beacon updated notification
   var pubBeaconUpdated = function (beaconData) {
	   _publish(beaconAPIServiceConfig.beaconUpdated, {beaconData : beaconData});
   };
   // subscribe to beacon updated notification
   var subBeaconUpdated = function ($scope, scopeHandler) {
	   _subscribe(beaconAPIServiceConfig.beaconUpdated, $scope, scopeHandler, function(args) { return args.beaconData; });
   };
   
   // publish beacons updated notification
   //beaconKeys is an array of beaconKey => true
   var pubBeaconsUpdated = function (beaconKeys) {
	   _publish(beaconAPIServiceConfig.beaconsUpdated, {beaconKeys : beaconKeys});
   };
   // subscribe to beacon updated notification
   var subBeaconsUpdated = function ($scope, scopeHandler) {
	   _subscribe(beaconAPIServiceConfig.beaconsUpdated, $scope, scopeHandler, function(args) { return args.beaconKeys; });
   };
   
   // return the publicly accessible methods
   return {
	   pubGetAllBeaconsSuccess	: pubGetAllBeaconsSuccess,
	   subGetAllBeaconsSuccess	: subGetAllBeaconsSuccess,
	   pubGetAllBeaconsError 	: pubGetAllBeaconsError,
	   subGetAllBeaconsError 	: subGetAllBeaconsError,
	   
	   
	   pubUuidAdded : pubUuidAdded,
	   subUuidAdded : subUuidAdded,
	   pubBeaconUpdated : pubBeaconUpdated,
	   subBeaconUpdated : subBeaconUpdated,
	   pubBeaconsUpdated : pubBeaconsUpdated,
	   subBeaconsUpdated : subBeaconsUpdated
	   
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
					console.log('beacons loaded from server'); 
					beaconAPIChannel.pubGetAllBeaconsSuccess(data);
					defer.resolve(data);
				})
				.error(function(data, status, headers, config){
					beaconAPIChannel.pubGetAllBeaconsError(data);
					defer.reject(data);
				});
				
				return defer.promise;
		};
				
		return {
			getAllBeacons : getAllBeacons,
		}; 
	
	} ]);

//ajax calls
beaconAPIServices.factory('serverBeaconStore', [
             'generalServiceConfig', 'beaconAPIChannel', 'beaconAPIService','$filter', '$q',
	function( generalServiceConfig,   beaconAPIChannel,   beaconAPIService,  $filter,   $q ) {
		
		//filters
		var bcmsBeaconKeyToObj 	= $filter('bcmsBeaconKeyToObj'),
			iBeaconUuidToHex	= $filter('iBeaconUuidToHex');
		
		//stores
		//set to indefined, it will be initialized in addBeacon function
		var initializedState = false,
			beaconList = {},
			uuids = {};
		
		
		var isInitialized = function() {
			return initializedState;
		};
		
		//returns all (filtered) items
		var _getAll = function(items, filter) {
			
			var defer = $q.defer(),
			allFilteredItems = undefined;

			if(Object.keys(items).length > 0) {

				if(filter) {
					 allFilteredItems = $filter('filter')(items, filter);
				} else {
					allFilteredItems =  items;
				}	
				
			} else {
				allFilteredItems = undefined;
			}
			
			if(allFilteredItems != undefined) {
				defer.resolve(allFilteredItems);
			} else {
				defer.reject(undefined);
			}
			
			return defer.promise; 
		}

		//returns filtered itmes by filter param 
		//filter {nid:3}
		var _get = function(filter, items) {
			
			var defer = $q.defer(),
				filteredItems = $filter('filter')(items, filter);
			
			if(filteredItems.length > 0) {
				item = filteredItems[0];
			} else { 
				item = undefined;
			}
				
			if(item != undefined) {
				defer.resolve(item);
			}
			
			return defer.promise;
		}
		
		//public useed methods
		var getAllUuids = function(filter) {
			var defer = $q.defer();
			
			_getAll(uuids, filter).then(
					//success
	    			function (items) { defer.resolve(items);  }, 
	    			//error
	    			function(error) { defer.resolve(error); }
			);
			
			return defer.promise;
		}
		
		var getUuid = function(filter) {
			var defer = $q.defer();
			
			_get(uuids, filter).then(
					//success
	    			function (item) { defer.resolve(item);  }, 
	    			//error
	    			function(error) { defer.resolve(error); }
			);
			 
			return defer.promise;
			
		}
		
		var addUuid = function(uuid) {
			if(iBeaconUuidToHex(uuid)) {
				if(!uuids[uuid]) {
					uuids[uuid] = true;
					beaconAPIChannel.pubUuidAdded(uuid);
					return true;
				}
			}
		}
				
		var getAllBeacons = function(filter) {
			
			var defer = $q.defer();

			_getAll(beaconList, filter).then(
					//success
	    			function (items) { defer.resolve(items);  }, 
	    			//error
	    			function(error) { defer.resolve(error); }
			);
			
			return defer.promise;
		}
		
		var getBeacon = function(filter) {
			var defer = $q.defer();
			
			_get(beaconList, filter).then(
					//success
	    			function (item) { defer.resolve(item);  }, 
	    			//error
	    			function(error) { defer.resolve(error); }
			);
			
			return defer.promise;
		}
		
		var addBeacon = function(beaconData) {
			if(beaconData.iBeaconUuid != false) {
				if(iBeaconUuidToHex(beaconData.iBeaconUuid)) {
						
						var bcmsBeaconKey = beaconData.iBeaconUuid+'.'+beaconData.major+'.'+beaconData.minor;
						beaconList[bcmsBeaconKey] = beaconData;
						addUuid(beaconData.iBeaconUuid);

						beaconAPIChannel.pubBeaconUpdated(beaconData);
						
						return true;
				}
				
			}
			return false;
		}
		
		var updateBeaconList = function() {

			var defer = $q.defer(),
				updatedBeacons = [];
			
			beaconAPIService.getAllBeacons()
		    	.then(
	    			//success
	    			function (newBeaconList) { 
	    				angular.forEach(newBeaconList, function(beacon, key) {
	    					initializedState = true;  
	    					if(addBeacon(beacon)) {
	    						updatedBeacons.push(key);
	    					}
	    				});	
	    				beaconAPIChannel.pubBeaconsUpdated(updatedBeacons);
	    				defer.resolve(updatedBeacons);
	    			},
		    		//error
		    		function(error) { defer.reject(updatedBeacons); }
	    		); 
			
			return defer.promise;
		}
		
		//public accessible methods
		return {
			isInitialized : isInitialized,
			getAllUuids : getAllUuids,
			getUuid : getUuid, 
			addUuid : addUuid,
			
			getAllBeacons : getAllBeacons,
			getBeacon : getBeacon,
			addBeacon: addBeacon,
			updateBeaconList : updateBeaconList,
			
		};
	
	} ]);