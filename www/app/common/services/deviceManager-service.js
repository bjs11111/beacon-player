/* Services */
var deviceManagers = angular.module('deviceManager', ['bleChannels', 'bleFilters']);

deviceManagers.constant( "bleDeviceServiceConfig", {
	
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
	
});

/*http and bel data mapper*/
deviceManagers.factory('bleDeviceService', [ '$rootScope',  '$filter', 'bleDeviceServiceConfig', 'bleScannerChannel',         
                                    function( $rootScope,    $filter,   bleDeviceServiceConfig,	  bleScannerChannel ){
         	  //needed to use the $on method in the bleNotoficationChannel
         	  //http://stackoverflow.com/questions/16477123/how-do-i-use-on-in-a-service-in-angular
         	  var scope = $rootScope.$new();  // or $new(true) if you want an isolate scope

         	  //list of all scanned devices [ iBeaconUuid.Major.Minor => deviceData, ]
         	  var knownDevicesList = [];
         	  //
         	  var bcmsBeaconKeyToObj  = $filter('bcmsBeaconKeyToObj');
         	  	         	  
         	  //         	  
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
         		  //console.log(JSON.stringify(rawDevice)); 
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
     
}]);    