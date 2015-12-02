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
	   console.log('subExitedTriggerArea');
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
         	  		knownDevicesList = {},
         	  		defaultData = {};
           			
			  		defaultData.scanData = {};
					defaultData.scanData.alreadyTriggered 	= false;
					defaultData.scanData.lastTriggerArea 	= bleDeviceServiceConfig.triggerAreas.outOfRange;
					defaultData.scanData.actualTriggerArea 	= bleDeviceServiceConfig.triggerAreas.outOfRange;
					defaultData.scanData.lastRssiValue		= -100;
					defaultData.scanData.rssi		= -100;
					defaultData.scanData.lastScan	= 0;
					
					defaultData.bcmsBeacon = {};
					defaultData.bcmsBeacon.alreadyTriggered 	= false;
					
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
               
               //this function holds all logic for updating and interpreting data form scanner and server
               var mapBeaconDataToKnownDevices = function(deviceData, type) {
            	   	  type = (type)?type:false;
             	 
	             	  var 	bcmsBeaconKey  = deviceData.iBeaconUuid+'.'+deviceData.major+'.'+deviceData.minor, 
	             	  		oldItem = false,
	             	  		updatedItem = false;
	             	 
	             	  		defaultData.bcmsBeaconKey = bcmsBeaconKey;
	             	  		
	             	  		//get matching item from knownDevicesList
	             	  		if(angular.isObject(knownDevicesList[bcmsBeaconKey])) {
	             	  			oldItem = knownDevicesList[bcmsBeaconKey];
	             	  		}
	             	  		//if item not exist create item from defaultData
	             	  		else {
	             	  			oldItem = angular.extend({} , defaultData, {'bcmsBeaconKey':bcmsBeaconKey});
	             	  		}

	             	  		updatedItem = angular.copy(oldItem);
	             	  		//console.log(type);
	             	  		
	             	  	//device from ble scanner
	             	  if ( type == bleDeviceServiceConfig.mapTypeBleDevice ) {
	             		  //just to make clear what to consider under deviceData
	             		  var newScanData = deviceData;
	             		  
	             		// console.log('o.r: '+ oldItem.bcmsBeaconKey, oldItem.scanData.rssi);
	             		//console.log('o.a:', oldItem.scanData.actualTriggerArea);
	             		//prepareTriggerData(oldItem, newScanData);
	             		newScanData = prepareTriggerData(oldItem, newScanData);
	             		
	             		 //console.log('n.rssi', newScanData.rssi); 
	             		// console.log('n.a', newScanData.actualTriggerArea); 
	             	  	 
	             		 updatedItem.scanData = angular.extend(oldItem.scanData, newScanData );

	            	    //console.log('u.r',  updatedItem.scanData.rssi); 
	             	    //console.log('u.a',  updatedItem.scanData.actualTriggerArea); 
	             		//console.log('updatedItem.bcmsBeacon.contentTitle:', updatedItem.bcmsBeacon.contentTitle); 
	             	  } 
	             	  //bcmsData
	             	  else if (type == bleDeviceServiceConfig.mapTypeAPIDevice ) {
	             		 updatedItem.bcmsBeacon =  deviceData;
	             		
	             			 
	        
	             		 
	             	  } 
	             	  else { 
	             		  console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! mapBeaconDataToKnownDevices check this!'); 
	             		  return; 
	             	  }         
	         	  
	         		 knownDevicesList[bcmsBeaconKey] = updatedItem;
	         		 
	         		//console.log('updatedItem.bcmsBeacon.contentTitle!:', updatedItem.bcmsBeacon.contentTitle); 

	         		 tryPubTriggerEvent(updatedItem);
	    
	         		 bleDeviceChannel.pubKnownDeviceUpdated(bcmsBeaconKey);
	         		 
	         		 
               }
               
               

          		//this is used to update after serverdata updated   	
              	var prepareTriggerData = function(oldItem, newScanData, bcmsBeaconKey)  {
              		
              			var updatedScanData = angular.copy(oldItem.scanData),
              			    triggerZone = bleDeviceServiceConfig.triggerZones.noServerConfig.name;

   	    				if(oldItem.bcmsBeacon) {
   	           				triggerZone = (oldItem.bcmsBeacon.triggerZone) ? oldItem.bcmsBeacon.triggerZone : triggerZone;
   	           			}
   	    				
   	    				//console.log(triggerZone);
   	    				updatedScanData.actualTriggerArea 		= calculateActualTriggerArea(oldItem, newScanData, triggerZone);
   	    				
   	    				updatedScanData.alreadyTriggered 		= oldItem.scanData.alreadyTriggered;
   	    				
   	    				updatedScanData.lastTriggerArea 		= oldItem.scanData.actualTriggerArea;

   	   				 	updatedScanData.lastRssiValue			= oldItem.scanData.rssi;
   	   				 	
   	   				 	updatedScanData.rssi					= newScanData.rssi;
   	   			
   	   				 	
   	   				 	//console.log( 'oldItem.scanData.rssi', oldItem.scanData.rssi ); 
   	   			
   	   				 	//console.log( 'newScanData.rssi', newScanData.rssi ); 
   	   				 	
   	   				    
   	   				 	
   	   					return updatedScanData;

              	};
              	
              	function calculateActualTriggerArea(oldItem, newScanData, triggerZone) {
      				
      				var ThresholdOffset = undefined;
      				var willEntry = undefined;
      				
      				
      				//detect willEntry value
      				//will entry or stay
      				if(		oldItem.scanData.lastTriggerArea === bleDeviceServiceConfig.triggerAreas.negative
      					||	oldItem.scanData.lastTriggerArea === bleDeviceServiceConfig.triggerAreas.outOfRange ) 
      				{ willEntry = true; }
      				//will exit or stay
      				else if( oldItem.scanData.lastTriggerArea === bleDeviceServiceConfig.triggerAreas.positive ) 
      				{ willEntry = false; } 
      				
      				if(willEntry === undefined) { 
      					//console.log( 'SCANTEST: willEntry is undefined: ' + oldItem.scanData.lastTriggerArea + '=>' + newScanData.actualTriggerArea); 
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
      				//console.log( 'newScanData.rssi : ', newScanData.rssi ); 
      				//console.log( 'newScanData.rssiOneMeterDistance  + ThresholdOffset', newScanData.rssiOneMeterDistance  + ThresholdOffset); 
      				//console.log( newScanData.rssi + '>='+ (newScanData.rssiOneMeterDistance + ThresholdOffset),  ( ( newScanData.rssi >= newScanData.rssiOneMeterDistance  + ThresholdOffset)?'po':'ne') ); 
      				
      				if( newScanData.rssi >= newScanData.rssiOneMeterDistance  + ThresholdOffset) 
      				{
      					return bleDeviceServiceConfig.triggerAreas.positive;
      				}
      				//stay 
      				else {
      					return bleDeviceServiceConfig.triggerAreas.negative;
      				}	

      			};


               
            /**
       		 * tryPubTriggerEvent
       		 */
       		var tryPubTriggerEvent = function(deviceData) {

       			// outOfRange -> positive || negative -> positive
    			if(		deviceData.scanData.lastTriggerArea 	=== bleDeviceServiceConfig.triggerAreas.outOfRange
    				&&	deviceData.scanData.actualTriggerArea 	=== bleDeviceServiceConfig.triggerAreas.positive
    				
    				|| 	
    				
    				deviceData.scanData.lastTriggerArea 	=== bleDeviceServiceConfig.triggerAreas.negative
    				&&	deviceData.scanData.actualTriggerArea 	=== bleDeviceServiceConfig.triggerAreas.positive  
    			) { 
    				
					console.log('o-p||n-p:' );
    				//console.log( 'deviceData.bcmsBeacon.contentTitle111: ', JSON.stringify(deviceData.bcmsBeacon) );
    				//console.log('knownDevicesList[deviceData.bcmsBeaconKey]: ', knownDevicesList[deviceData.bcmsBeaconKey].bcmsBeacon); 
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