/* Services */
var deviceManagers = angular.module('deviceManagers', ['bleFilters', 'bleChannels', 'beaconAPIServices']);

deviceManagers.constant( "bleDeviceChannelConfig", {
	//events
	bleDeviceUpdates		: 'bleDeviceUpdates',
	bleDevicesUpdates 		: 'bleDevicesUpdates',
});

//bleDeviceChannel 
deviceManagers.factory('bleDeviceChannel', 
		['$rootScope', 'bleDeviceChannelConfig',
function ($rootScope,   bleDeviceChannelConfig) {
   
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
   var pubKnownDeviceUpdated = function (knownDeviceKey) {
	   _publish(bleDeviceChannelConfig.bleDeviceUpdates, {knownDeviceKey : knownDeviceKey});
   };
   // subscribe to knownDevices updated notification
   var subKnownDeviceUpdated = function ($scope, scopeHandler) {
	   console.log('subKnownDeviceUpdated');
	   _subscribe(bleDeviceChannelConfig.bleDeviceUpdates, $scope, scopeHandler, function(args) { return args.knownDeviceKey; });
   };
   
// publish knownDevices updated notification
   var pubKnownDevicesUpdated = function (knownDeviceKeys) {
	   _publish(bleDevicesChannelConfig.bleDevicesUpdates, {knownDeviceKeys : knownDeviceKeys});
   };
   // subscribe to knownDevices updated notification
   var subKnownDevicesUpdated = function ($scope, scopeHandler) {
	   console.log('subKnownDevicesUpdated');
	   _subscribe(bleDevicesChannelConfig.bleDevicesUpdates, $scope, scopeHandler, function(args) { return args.knownDeviceKeys; });
   };
   
   // return the publicly accessible methods
   return {
	   subKnownDeviceUpdated 			: subKnownDeviceUpdated,
	   pubKnownDeviceUpdated			: pubKnownDeviceUpdated,
	   
	   subKnownDevicesUpdated 			: subKnownDevicesUpdated,
	   pubKnownDevicesUpdated			: pubKnownDevicesUpdated,
   	};
}]);

deviceManagers.constant( "bleDeviceServiceConfig", {
	mapTypeBleDevice	: 'scanData',
	mapTypeAPIDevice	: 'bcmsBeacon',
	
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
	
});


/*http and bel data mapper*/
deviceManagers.factory('bleDeviceService', 
		['$rootScope', '$q', '$filter', 'bleDeviceServiceConfig', 'bleDeviceChannel', 'bleScannerChannel', 'beaconAPIService', 'beaconAPIChannel',        
function( $rootScope,   $q,   $filter,   bleDeviceServiceConfig,   bleDeviceChannel,   bleScannerChannel,   beaconAPIService,   beaconAPIChannel){
	 		  // $new(true) => isolate scope
			  var 	scope = $rootScope.$new(), 
         	  // list of all scanned devices [ iBeaconUuid.Major.Minor => deviceData, ]
         	  		knownDevicesList = [];
         	  //
         	  		//bcmsBeaconKeyToObj  = $filter('bcmsBeaconKeyToObj');
         	
			 var subGetAllBeaconsHandler =  function(beaconList)  {
         		 angular.forEach(beaconList, function(beacon, key) {
 					mapBeaconDataToKnownDevices(beacon, bleDeviceServiceConfig.mapTypeAPIDevice); 
 				});	
	         };
	         	  
			  
              // triggers getAllBeacons request
              var updateBeaconsFromServer = function() {
            	  var defer = $q.defer();
            	  
            	  beaconAPIService
            	  .getAllBeacons().then( 
            			  function(beaconList) {
		            		  angular.forEach(beaconList, function(beacon, key) {
		       				     mapBeaconDataToKnownDevices(beacon, bleDeviceServiceConfig.mapTypeAPIDevice); 
		       				  });	
		            		  defer.resolve();
		            	  },
		            	  function() {
		            		  defer.reject();
		            	  }
            	  ); 
            	  
            		
  				   return defer.promise;
              };
			  
               // returns the array of knownDevices
               var getKnownDevices = function() {
             	  return knownDevicesList; 
               };
               
               var getKnownDevice = function(cmsBeaconKey) {
             	  var searchedDevice = knownDevicesList[cmsBeaconKey];
             	  if(searchedDevice) { return searchedDevice; }
             	  return false; 
               };
               
               //this function holds all logic for updating and interpreting data form scanner and server
               var mapBeaconDataToKnownDevices = function(deviceData, type) {
             	  type = (type)?type:false;
             	
             	  var 	bcmsBeaconKey  = deviceData.iBeaconUuid+'.'+deviceData.major+'.'+deviceData.minor, 
             	  		inTriggerRange  = false,
             	  		data = knownDevicesList[bcmsBeaconKey];
             	 
             	  //@TODO abstract and move this mapping
             	  //init
             	  if( !data ) {
             		  data = {};
         			  data.bcmsBeaconKey = bcmsBeaconKey;
             	  }  
             	
             	  //device from ble scanner
         		  if ( type == bleDeviceServiceConfig.mapTypeBleDevice ) {
         			  
         			  data.scanData = deviceData;
         			  knownDevicesList[bcmsBeaconKey] = data;
         			  
             	  } 
             	  //bcmsData
             	  else if ( bleDeviceServiceConfig.mapTypeAPIDevice ) {
             		  data.bcmsBeacon = deviceData;
             		  knownDevicesList[bcmsBeaconKey] = data;
             	  } else {
             		  console.log('check this!'); 
             		  return;
             	  }
         		 
         		  bleDeviceChannel.pubKnownDeviceUpdated(bcmsBeaconKey);
         		
               }
               
         	  var onFoundBleDeviceHandler = function(rawDevice)  {
         		 mapBeaconDataToKnownDevices(rawDevice, bleDeviceServiceConfig.mapTypeBleDevice);  
         	  };
         	  
         	  var init = function() {
         		bleScannerChannel.onFoundBleDevice(scope, onFoundBleDeviceHandler); 
         	  };
               
               //do initialisation 
               init();
               
               // return the public accessible methods
               return {
            	  updateBeaconsFromServer		: updateBeaconsFromServer,
             	  getKnownDevices				: getKnownDevices,
             	  getKnownDevice				: getKnownDevice,
             	  mapBeaconDataToKnownDevices	: mapBeaconDataToKnownDevices,
             	  //calculateActualTriggerArea	: calculateActualTriggerArea
               };
     
}]);   