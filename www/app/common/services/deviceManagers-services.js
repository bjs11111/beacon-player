/* Services */
var deviceManagers = angular.module('deviceManagers', ['bleFilters', 'bleChannels', 'beaconAPIServices']);

deviceManagers.constant( "bleDeviceChannelConfig", {
	//events
	bleDeviceUpdates	: 'bleDeviceUpdates',
	bleDevicesUpdates 	: 'bleDevicesUpdates',
	
	enteredTriggerArea 	: 'enteredTriggerArea',
	exitTriggerArea 	: 'exitTriggerArea '
});

//bleDeviceChannel 
deviceManagers.factory('bleDeviceChannel',
		['$rootScope', 'bleDeviceChannelConfig','beaconAPIChannel',
function ($rootScope,   bleDeviceChannelConfig,  beaconAPIChannel) {
   
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
	   _publish(bleDeviceChannelConfig.bleDevicesUpdates, {knownDeviceKeys : knownDeviceKeys});
   };
   // subscribe to knownDevices updated notification
   var subKnownDevicesUpdated = function ($scope, scopeHandler) {
	   console.log('subKnownDevicesUpdated');
	   _subscribe(bleDeviceChannelConfig.bleDevicesUpdates, $scope, scopeHandler, function(args) { return args.knownDeviceKeys; });
   };

   // publish knownDevices updated notification
   var pubEnteredTriggerArea = function (device) {
	   _publish(bleDeviceChannelConfig.enteredTriggerArea, {device : device});
   };
   // subscribe to knownDevices updated notification
   var subEnteredTriggerArea = function ($scope, scopeHandler) {
	   console.log('subEnteredTriggerArea');
	   _subscribe(bleDeviceChannelConfig.enteredTriggerArea, $scope, scopeHandler, function(args) { return args.device; });
   };
   
   // publish knownDevices updated notification
   var pubExitTriggerArea = function (device) {
	   _publish(bleDeviceChannelConfig.exitTriggerArea, {device : device});
   };
   // subscribe to knownDevices updated notification
   var subExitTriggerArea = function ($scope, scopeHandler) {
	   console.log('subEnteredTriggerArea');
	   _subscribe(bleDeviceChannelConfig.exitTriggerArea, $scope, scopeHandler, function(args) { return args.device; });
   };
   
   // return the publicly accessible methods
   return {
	   subKnownDeviceUpdated 			: subKnownDeviceUpdated,
	   pubKnownDeviceUpdated			: pubKnownDeviceUpdated,
	   
	   subKnownDevicesUpdated 			: subKnownDevicesUpdated,
	   pubKnownDevicesUpdated			: pubKnownDevicesUpdated,
	   
	   subEnteredTriggerArea 			: subEnteredTriggerArea,
	   pubEnteredTriggerArea 			: pubEnteredTriggerArea,
	   
	   subExitTriggerArea 			: subExitTriggerArea,
	   pubExitTriggerArea 			: pubExitTriggerArea
	   
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
		noServerConfig  : {
							name 					: 'NoServerConfig',
							entryThresholdOffset 	: 10,
							exitThresholdOffset 	: -10
		},
		near 			: { 
							name 					: 'Near',
							entryThresholdOffset 	: 20,
							exitThresholdOffset 	: 10
						  },
		intermediate 	: { 
							name 					: 'Intermediate',
							entryThresholdOffset 	: 10,
							exitThresholdOffset 	: -10
						  },
		far 			: { 
							name 					: 'Far',
							entryThresholdOffset 	: -10,
							exitThresholdOffset 	: -40
						  },
	},
	
});


/*http and bel data mapper*/
deviceManagers.factory('bleDeviceService', 
		['$rootScope', '$q', '$filter', 'bleDeviceServiceConfig', 'bleDeviceChannel', 'bleScannerChannel', 'beaconAPIService', 'beaconAPIChannel','serverBeaconStore',        
function( $rootScope,   $q,   $filter,   bleDeviceServiceConfig,   bleDeviceChannel,   bleScannerChannel,   beaconAPIService,   beaconAPIChannel, serverBeaconStore){
			
			
			  // $new(true) => isolate scope
			  var 	scope = $rootScope.$new(), 
         	  // list of all scanned devices [ iBeaconUuid.Major.Minor => deviceData, ]
         	  		knownDevicesList = {};
         	  		//bcmsBeaconKeyToObj  = $filter('bcmsBeaconKeyToObj');

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
               
            /**
       		 * tryPubTriggerEvent
       		 */
       		var tryPubTriggerEvent = function(deviceData) {
 
       			//console.log(deviceData.scanData.lastTriggerArea, deviceData.scanData.actualTriggerArea);
       			if( !deviceData.scanData || !('lastTriggerArea' in deviceData.scanData)) {
       				return;
       			}
       			// outOfRange -> positive || negative -> positive
    			if(		deviceData.scanData.lastTriggerArea 	=== bleDeviceServiceConfig.triggerAreas.outOfRange
    				&&	deviceData.scanData.actualTriggerArea 	=== bleDeviceServiceConfig.triggerAreas.positive
    				
    				|| 	
    				
    				deviceData.scanData.lastTriggerArea 	=== bleDeviceServiceConfig.triggerAreas.negative
    				&&	deviceData.scanData.actualTriggerArea 	=== bleDeviceServiceConfig.triggerAreas.positive  
    			) { 
    				
					console.log('o-p||n-p:' );
    				bleDeviceChannel.pubEnteredTriggerArea(deviceData);
					return;
    			}
    			
    			// positive -> negative
    			else if( 	deviceData.scanData.lastTriggerArea 	=== bleDeviceServiceConfig.triggerAreas.positive
    					&&	deviceData.scanData.actualTriggerArea 	=== bleDeviceServiceConfig.triggerAreas.negative  ) 
    			{ 
    				bleDeviceChannel.pubExitTriggerArea(deviceData);
    				console.log('p-n:');
					return;
    			}
	
       		}
       		
       		//this is used to update after serverdata updated   	
           	var mapForTriggerFunctions = function(scanData)  {

           			//console.log( 'actualDevice', JSON.stringify(scanData) ); 
           			var triggerZone = bleDeviceServiceConfig.triggerZones.noServerConfig.name;
           		
	           		var defaultData = {};
	           			defaultData.scanData = {};
						defaultData.scanData.alreadyTriggered 	= false;
						defaultData.scanData.lastTriggerArea 	= bleDeviceServiceConfig.triggerAreas.outOfRange;
						defaultData.scanData.actualTriggerArea 	= bleDeviceServiceConfig.triggerAreas.outOfRange;
						defaultData.scanData.lastRssiValue		= -100;
						//console.log('defaultData.scanData.actualTriggerArea', JSON.stringify(defaultData.scanData.actualTriggerArea) ); 
           			var oldItem = knownDevicesList[scanData.bcmsBeaconKey];
           				oldItem = (oldItem)? oldItem : false; 
           				// console.log('oldItem:', oldItem);
           			//a new reference
           			var updatedScanData = angular.copy(scanData);
           			//console.log(JSON.stringify(updatedScanData));
           			
           			//console.log(actualDevice.bcmsBeacon.triggerZone, triggerZone);
           			
           			if(!oldItem) {
           				//console.log('new');
           				
           					updatedScanData = angular.extend(updatedScanData, defaultData.scanData);
               				console.log('new');
    	    				console.log(JSON.stringify(updatedScanData.actualTriggerArea));
               				//console.log('fresh trigger', updatedScanData.actualTriggerArea);
           				//console.log(updatedScanData); 
           				//console.log('return when fail;'); 
	    			}
	    			//update
	    			else {
	    				console.log('old');
	    				console.log(JSON.stringify(scanData.actualTriggerArea)); 
	    				updatedScanData.alreadyTriggered 		= updatedScanData.alreadyTriggered;
	    				updatedScanData.lastTriggerArea 		= updatedScanData.actualTriggerArea;
	    				
	    				//console.log('old trigger', updatedScanData.actualTriggerArea);
	    				if(oldItem.bcmsBeacon) {
	           				triggerZone = (oldItem.bcmsBeacon.triggerZone)?oldItem.bcmsBeacon.triggerZone : triggerZone;
	           			}
	           			
	    				console.log( 'triggerArea', calculateActualTriggerArea(updatedScanData, triggerZone) );
					 	updatedScanData.actualTriggerArea 	= calculateActualTriggerArea(updatedScanData, triggerZone);
	   				 	//console.log('new trigger', updatedScanData.actualTriggerArea);
	   				 	updatedScanData.lastRssiValue			= updatedScanData.rssi;
	   				 	//updatedScanData.rssi					= updatedScanData.rssi;
	   					//console.log('odl'); 
	    				//console.log(JSON.stringify(updatedScanData));  
	    			}

           			return updatedScanData;
           			
           			/////////////////////////////
           			 
           			function calculateActualTriggerArea(deviceData, triggerZone) {
           				
           				var ThresholdOffset = undefined;
           				var willEntry = undefined;
           				
           				
           				//console.log(deviceData.lastTriggerArea); return;
           				//detect willEntry value
           				//will entry or stay
           				if(		deviceData.lastTriggerArea === bleDeviceServiceConfig.triggerAreas.negative
           					||	deviceData.lastTriggerArea === bleDeviceServiceConfig.triggerAreas.outOfRange ) 
           				{ willEntry = true; }
           				//will exit or stay
           				else if( deviceData.lastTriggerArea === bleDeviceServiceConfig.triggerAreas.positive ) 
           				{ willEntry = false; } 
           				
           				if(willEntry === undefined) { 
           					//console.log( 'SCANTEST: willEntry is undefined: ' + deviceData.lastTriggerArea + '=>' + deviceData.actualTriggerArea); 
           					return; 
           				}
           				
           				//console.log('willEntry', willEntry);
           				
           				//console.log('triggerZone', triggerZone);
           				
           				switch(triggerZone) {
           					case bleDeviceServiceConfig.triggerZones.near.name:
           						//console.log('near willEntry' , willEntry); 
           						ThresholdOffset = (willEntry)?bleDeviceServiceConfig.triggerZones.near.entryThresholdOffset:bleDeviceServiceConfig.triggerZones.near.exitThresholdOffset;
           					break;
           					case bleDeviceServiceConfig.triggerZones.intermediate.name:
           						//console.log('intermediate willEntry' , willEntry); 
           						ThresholdOffset = (willEntry)?bleDeviceServiceConfig.triggerZones.intermediate.entryThresholdOffset:bleDeviceServiceConfig.triggerZones.intermediate.exitThresholdOffset;
           					break;
           					case bleDeviceServiceConfig.triggerZones.far.name:
           						//console.log('far willEntry' , willEntry); 
           						ThresholdOffset = (willEntry)?bleDeviceServiceConfig.triggerZones.far.entryThresholdOffset:bleDeviceServiceConfig.triggerZones.far.exitThresholdOffset;
           					break;	
           					default:
           						//console.log('noServerConfig');
           						ThresholdOffset = (willEntry)?bleDeviceServiceConfig.triggerZones.noServerConfig.entryThresholdOffset:bleDeviceServiceConfig.triggerZones.noServerConfig.exitThresholdOffset;
           						break;
           				}
           				
           				if(ThresholdOffset === undefined) {  
           					//console.log('ThresholdOffset is undefined'); 
           					return; 
           				}
           				 
           				//console.log( 'ThresholdOffset: ', ThresholdOffset ); 
           				//console.log( 'deviceData.rssi : ', deviceData.rssi ); 
           				//console.log( 'deviceData.rssiOneMeterDistance  + ThresholdOffset', deviceData.rssiOneMeterDistance  + ThresholdOffset); 
           				//console.log( deviceData.rssi + '>='+ deviceData.rssiOneMeterDistance +'+'+ ThresholdOffset); 
           				
           				if( deviceData.rssi >= deviceData.rssiOneMeterDistance  + ThresholdOffset) 
           				{
           					return bleDeviceServiceConfig.triggerAreas.positive;
           				}
           				//stay
           				else {
           					return bleDeviceServiceConfig.triggerAreas.negative;
           				}	

           			};

           	};

               
               //this function holds all logic for updating and interpreting data form scanner and server
               var mapBeaconDataToKnownDevices = function(deviceData, type) {
            	   	  type = (type)?type:false;
             	 
	             	  var 	bcmsBeaconKey  = deviceData.iBeaconUuid+'.'+deviceData.major+'.'+deviceData.minor, 
	             	  		defaultData = { bcmsBeaconKey:bcmsBeaconKey },
	             	  		currentItem = angular.isObject(knownDevicesList[bcmsBeaconKey])?knownDevicesList[bcmsBeaconKey]:{};
	             	  		
	             	  		//if empty
	             	  		currentItem.bcmsBeaconKey = bcmsBeaconKey;

	             	
	             	  //device from ble scanner
	         		  if ( type == bleDeviceServiceConfig.mapTypeBleDevice ) {
	         			  console.log('map', JSON.stringify(mapForTriggerFunctions(deviceData))); 
	         			 currentItem.scanData = mapForTriggerFunctions(deviceData);
	         			  
	         			// currentItem.scanData = deviceData;
	             	  } 
	             	  //bcmsData
	             	  else if ( bleDeviceServiceConfig.mapTypeAPIDevice ) {
	             		  currentItem.bcmsBeacon = deviceData; 
	             	  } 
	             	  else {
	             		  //console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!mapBeaconDataToKnownDevices check this!'); 
	             		  return; 
	             	  }         
	         		  
	         		//console.log('pre',  JSON.stringify(currentItem) ); 
	         		  
	         		 
	         		 console.log('post',  JSON.stringify(currentItem.scanData) ); 
	         		
	         		 //console.log('after data: ', JSON.stringify(bcmsBeaconKey));
	         		  
	         		 knownDevicesList[bcmsBeaconKey] = currentItem;
	         		 
	         		 
	         		 
	         		 tryPubTriggerEvent(currentItem);
	         		 bleDeviceChannel.pubKnownDeviceUpdated(bcmsBeaconKey);

               }
               
               
                
         	  var onFoundBleDeviceHandler = function(rawDevice)  {
         		 mapBeaconDataToKnownDevices(rawDevice, bleDeviceServiceConfig.mapTypeBleDevice);  
         	  };
         	  
         	 var onBeaconsUpdatedHandler = function(updatedBeaconKeys)  {
         		serverBeaconStore
         			.getAllBeacons(updatedBeaconKeys)
         				.then(
	         				function(bcmsBeacons) {
	         					//console.log('bcmsBeacons', bcmsBeacons);
	         					 angular.forEach(bcmsBeacons, function(bcmsBeacon) {
	         						//console.log('key,bcmsBeacon',bcmsBeacon);
	         	         			mapBeaconDataToKnownDevices(bcmsBeacon, bleDeviceServiceConfig.mapTypeAPIDevice);  
	         	         		 });
	         				},function(error) {
	         					//console.log('error',error);
	         				}
	         			);
         		
         	  };
         	  
         	 
         	  
         	  var init = function() {
         		bleScannerChannel.onFoundBleDevice(scope, onFoundBleDeviceHandler);
         		beaconAPIChannel.subBeaconsUpdated(scope, onBeaconsUpdatedHandler); 
         	  };
               
               //do initialisation 
               init();
               
               // return the public accessible methods
               return {
            	  updateBeaconsFromServer		: updateBeaconsFromServer,
             	  getKnownDevices				: getKnownDevices,
             	  getKnownDevice				: getKnownDevice,
             	  mapBeaconDataToKnownDevices	: mapBeaconDataToKnownDevices
               };
     
}]);   