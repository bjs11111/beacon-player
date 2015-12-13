;(function() {

	/**
	 * deviceDataManager Module
	 * 
	 * A http and bel data merger
	 * 
	 **/
	angular
    .module('commons.deviceDataManager.service', ['commons.deviceDataManager.channel', 'commons.deviceDataManagerService.constant'])
   .factory('DeviceDataManagerService', DeviceDataManagerService);
    
	DeviceDataManagerService.$inject= ['$rootScope','$q','$filter','DeviceDataManagerServiceConstant','DeviceDataManagerChannel','bleScannerChannel','beaconAPIService','beaconAPIChannel','serverBeaconStore'];      
	function DeviceDataManagerService(  $rootScope,  $q,  $filter,  DeviceDataManagerServiceConstant,  DeviceDataManagerChannel,  bleScannerChannel,  beaconAPIService,  beaconAPIChannel, serverBeaconStore) {
 
		var scope = $rootScope.$new(), 
	  		// list of all scanned devices in until app resounge  [ iBeaconUuid.Major.Minor => deviceData, ]
	  		knownDevicesList = {};

  		//the public accessible methods
        var deviceDataManagerService = {
    		  updateBeaconsFromServer		: updateBeaconsFromServer,
          	  getKnownDevices				: getKnownDevices,
          	  getKnownDevice				: getKnownDevice,
          	  mapBeaconDataToKnownDevices	: mapBeaconDataToKnownDevices
		};
        
        //do initialization 
        init();
            
        return deviceDataManagerService;
        
        ////////     
            
        /**
         * initialize the service
         */
        function init() {
      		bleScannerChannel.onFoundBleDevice(scope, onFoundBleDeviceHandler);
      		beaconAPIChannel.subBeaconsUpdated(scope, onBeaconsUpdatedHandler); 
        };
        
        /**
         * onFoundBleDeviceHandler
         * 
         * This is the callback for the FoundDevice event
         * It calls the mapBeaconDataToKnownDevices with the newly found device
         * 
         * @param rawDevice {Object} The rawDevice form istBleScanner
         */
        function onFoundBleDeviceHandler(rawDevice)  {
    		 mapBeaconDataToKnownDevices(rawDevice, DeviceDataManagerServiceConstant.mapTypeBleDevice);  
    	};
    	  
    	/**
    	 * onBeaconsUpdatedHandler
    	 * 
    	 * This is the callback for the BeaconsUpdated event
    	 * It merges the new data form server one by one into the knownDevicesList
    	 * 
    	 * @param updatedBeaconKeys {Array} array of updated bcmsBeaconKeys
    	 * 
    	 */
    	function onBeaconsUpdatedHandler(updatedBeaconKeys)  {
    		serverBeaconStore
    			//getAllBeacons returns a clean (copied reference)
    			.getAllBeacons()
    				.then( 
        				function(bcmsBeacons) {
        					 angular.forEach(bcmsBeacons, function(bcmsBeacon) { 
        	         			mapBeaconDataToKnownDevices(bcmsBeacon, DeviceDataManagerServiceConstant.mapTypeAPIDevice);  
        	         		 }); 
        				},function(error) {
        					//console.log('error',error);
        				}
        			);
    		
    	  };
        
        /**
         * updateBeaconsFromServer
         * 
         * This function uses the beaconAPIService to get all beacons 
         * and merges the result one by one into the knownDevicesList
         * 
         * @return {Promise} empty promise
         * 
         */
        function updateBeaconsFromServer() {
	    	  var defer = $q.defer();
	    	  
	    	  beaconAPIService
	        	  .getAllBeacons().then( 
	        			  function(beaconList) {
		            		  angular.forEach(beaconList, function(beacon, key) {
		       				     mapBeaconDataToKnownDevices(beacon, DeviceDataManagerServiceConstant.mapTypeAPIDevice); 
		       				  });	
		            		  defer.resolve(true);
		            	  },
		            	  function() {
		            		  defer.reject(false);
		            	  }
	        	  );
	    	  
			  return defer.promise;
        };
				  
       // returns the array of knownDevices
        /**
         * getKnownDevices
         * 
         * returns a clean reference of the actual knownDevicesList
         * 
         *  @TODO make it filterable        
         *           
         * @return {Object} the knownDevicesList
         */
       function getKnownDevices() {
     	  	return angular.extend({},knownDevicesList); 
       };
       
       /**
        * getKnownDevice
        * 
        * returns a clean reference of a item mapping the given cmsBeaconKey
        * or false
        * 
        * @param cmsBeaconKey {Object} the cmsBeaconKey to search for
        * 
        * @return Object or false
        * 
        */
       function getKnownDevice(cmsBeaconKey) {
     	  	var searchedDevice = knownDevicesList[cmsBeaconKey];
     	  	if(searchedDevice) { return angular.extend({},searchedDevice); }
     	  	return false; 
       };
	               
       //this function holds all logic for updating and interpreting data form scanner and server
       //deviceData should be always a clean (copied reference to the data to prevent side effects)
   		
       //we receive a clean (copied reference of the deviceData)
       /**
        * mapBeaconDataToKnownDevices
        * 
        * This function merges either cms data or scan data into the knownDevicesList
        * 
        * @param deviceData {Object} The data to merge
        * @param type {String} which type of data to merge. Eigther scan data or cms data
        * 
        * @event {}
        */
   		function mapBeaconDataToKnownDevices(deviceData, type) {
   			
   			//vars
   			var 	bcmsBeaconKey  = deviceData.iBeaconUuid+'.'+deviceData.major+'.'+deviceData.minor, 
       	  			oldItem = false;

   			//check for mapping type
   			type = (type)?type:false;
   	
   			//skip if maptype not given
   			if(!type) { return; }
   			//console.log('mapType', type); 
   			
   			
   			//get matching item from knownDevicesList as clean (copied) reference 
   			var oldItem = angular.copy(knownDevicesList[bcmsBeaconKey]);
   			//console.log('oldScanItem 1', oldItem); 
   			//if item not exist create item from defaultData
      	  		if(!angular.isObject(oldItem)) {
      	  			//console.log('device is not in knownDevicesList'); 
      	  			oldItem = getItemWithDefaultData(bcmsBeaconKey);
      	  			//console.log('oldScanItem 2', oldItem); 
      	  		}
      	  		
   			
   			//maplogic
   			var mergedItem = false;
   			if ( type == DeviceDataManagerServiceConstant.mapTypeBleDevice ) {
   				//this returns a clean reference
   				var mergedItem1 = angular.merge({}, oldItem, {scanData : deviceData});
   				//console.log('mergedItem1', mergedItem1); 
   				//mergedItem = mergedItem1;
   				//this returns a clean reference
   				mergedItem = prepareTriggerData(mergedItem1, oldItem);
   			} 
   			else if (type == DeviceDataManagerServiceConstant.mapTypeAPIDevice ) {
   				mergedItem = angular.merge({}, oldItem, {bcmsBeacon : deviceData});
   			}
   			
   			
   			knownDevicesList[bcmsBeaconKey] = mergedItem;
   	   		 
   			//console.log('mergedItem', knownDevicesList[bcmsBeaconKey]); 
   			//console.log('updated knownDevicesList',angular.copy(knownDevicesList));
   			//console.log('updatedItem.bcmsBeacon.contentTitle!:', updatedItem.bcmsBeacon.contentTitle); 

   	   		//tryPubTriggerEvent(updatedItem);

   	   		DeviceDataManagerChannel.pubKnownDeviceUpdated(mergedItem);

       };
       
       /**
		 * mapScanData
		 * 
		 * This function receives new scanData and merges that with the old data to a new object
		 * 
		 * @param newPreparedScanData {Object} the new scandata from sitBleScanner
		 * @param oldItem {String} copy of the previous data from knownDevicesList
		 * 
		 * @return the merged data as new object
		 */
		function mapScanData(newScanData, oldItem) {
  	  	    return angular.merge({}, oldItem, {scanData : newScanData});
		}
		
		
		/**
		 * mapBcmsData
		 * 
		 * maps new bcmsBeacon data into knownDevicesList
		 * 
		 * @param newBcmsBeaconData {Object} the new data from serverBeaconStore
		 * @param oldItem {String} copy of the previous data from knownDevicesList
		 * 
		 * @return the
		 */
		function mapBcmsData(newBcmsBeaconData, oldItem) {
  	  		return angular.merge({}, oldItem, {bcmsBeacon : newBcmsBeaconData});
		}    
  		
       /**
		 * prepareTriggerData
		 * 
		 * This function adds trigger relevant data to the already mergedScandata
		 * 
		 * @param mergedScanData {Object} the already mergedScandata from mapScanData
		 * @param oldItem {String} copy of the previous data from knownDevicesList
		 * 
		 */
		function prepareTriggerData(newItem, oldItem)  {			
			
			//console.log('Trigger newItem', newItem);
			//console.log('Trigger oldItem', oldItem);
			var preparedTriggerItem = {},
				//if old item has no trigger relevant data (brand new item) merge trigger relevant default data to old item
				preparedOldItem = angular.merge({}, DeviceDataManagerServiceConstant.defaultData, oldItem),
				//if old item has no trigger relevant data (brand new item) merge trigger relevant default data to new item
				preparedNewItem = angular.merge({}, DeviceDataManagerServiceConstant.defaultData, newItem);
			
			//console.log('DeviceDataManagerServiceConstant.defaultData', DeviceDataManagerServiceConstant.defaultData); 
			//console.log('prepared1 Trigger newItem', preparedNewItem); 
			//console.log('prepared1 Trigger oldItem', preparedOldItem);
		
			preparedNewItem.scanData.lastTriggerArea 		= preparedOldItem.scanData.actualTriggerArea;
			preparedNewItem.scanData.actualTriggerArea 		= calculateActualTriggerArea(preparedNewItem, preparedOldItem);
			preparedNewItem.scanData.lastRssiValue  		= preparedOldItem.scanData.rssi;

			return preparedNewItem;
		};
      	
		function calculateActualTriggerArea(newItem, oldItem) {
  			//the default new triggerArea
	  		var newTriggerArea =  DeviceDataManagerServiceConstant.triggerAreas.outOfRange,
	  			//the default triggerZone if no bcmsBeacon is given
	  			triggerZone = DeviceDataManagerServiceConstant.triggerZones.noServerConfig.name,
	  			//{boolean} defines if the actual area of bledivice is in trigger range or not 
	  			//so it asks will the beacon entry or stay  or exit or stay in triggerarea
	  			willEntry = undefined,
	  			ThresholdOffset = undefined;
	  		
	  		if(oldItem.bcmsBeacon) {
	  			triggerZone = (oldItem.bcmsBeacon.triggerZone) ? oldItem.bcmsBeacon.triggerZone : triggerZone;
	  		}
	  		
			//will entry or stay
			if(		oldItem.scanData.lastTriggerArea === DeviceDataManagerServiceConstant.triggerAreas.negative
				||	oldItem.scanData.lastTriggerArea === DeviceDataManagerServiceConstant.triggerAreas.outOfRange ) 
			{ willEntry = true; }
			//will exit or stay
			else if( oldItem.scanData.lastTriggerArea === DeviceDataManagerServiceConstant.triggerAreas.positive ) 
			{ willEntry = false; } 
			//our data is not correctly prepared
			if(willEntry === undefined) {  
				//console.log( 'SCANTEST: willEntry is undefined!!'); 
				return newTriggerArea;
			}	
			//console.log('willEntry', willEntry);
				
			switch(triggerZone) {
				case DeviceDataManagerServiceConstant.triggerZones.near.name:
					//console.log('near willEntry' , willEntry); 
					ThresholdOffset = (willEntry)?DeviceDataManagerServiceConstant.triggerZones.near.entryThresholdOffset:DeviceDataManagerServiceConstant.triggerZones.near.exitThresholdOffset;
				break;
				case DeviceDataManagerServiceConstant.triggerZones.intermediate.name:
					//console.log('intermediate willEntry' , willEntry); 
					ThresholdOffset = (willEntry)?DeviceDataManagerServiceConstant.triggerZones.intermediate.entryThresholdOffset:DeviceDataManagerServiceConstant.triggerZones.intermediate.exitThresholdOffset;
				break;
				case DeviceDataManagerServiceConstant.triggerZones.far.name:
					//console.log('far willEntry' , willEntry); 
					ThresholdOffset = (willEntry)?DeviceDataManagerServiceConstant.triggerZones.far.entryThresholdOffset:DeviceDataManagerServiceConstant.triggerZones.far.exitThresholdOffset;
				break;	
				default:
					//console.log('noServerConfig');
					ThresholdOffset = (willEntry)?DeviceDataManagerServiceConstant.triggerZones.noServerConfig.entryThresholdOffset:DeviceDataManagerServiceConstant.triggerZones.noServerConfig.exitThresholdOffset;
					break;
			}
			
			if(ThresholdOffset === undefined) {  
				//console.log('ThresholdOffset is undefined'); 
				return newTriggerArea;
			}
			
			//console.log('ThresholdOffset', ThresholdOffset);
			//console.log( 'newItem.scanData.rssi : ', newItem.scanData.rssi ); 
			//console.log( 'newItem.scanData.rssiOneMeterDistance  + ThresholdOffset', newItem.scanData.rssiOneMeterDistance  + ThresholdOffset); 
	
			if( newItem.scanData.rssi >= newItem.scanData.rssiOneMeterDistance + ThresholdOffset) { return DeviceDataManagerServiceConstant.triggerAreas.positive; }
			else {	return DeviceDataManagerServiceConstant.triggerAreas.negative; }	

	};


	               
	/**
	 * tryPubTriggerEvent
	 * 
	 * here we trigger the enter and exit events for scan data changes
	 * 
	 * @param newItem {Object} The new scandata already perpared for trigger
	 * 
	 * @event Entered- and Exit-TriggerArea events with the newItem
	 * 
	 */
   	function tryPubTriggerEvent(newItem) {

   			// outOfRange -> positive || negative -> positive
			if(		newItem.scanData.lastTriggerArea   === DeviceDataManagerServiceConstant.triggerAreas.outOfRange
				&&	newItem.scanData.actualTriggerArea === DeviceDataManagerServiceConstant.triggerAreas.positive
				
				|| 	
				
					newItem.scanData.lastTriggerArea 	=== DeviceDataManagerServiceConstant.triggerAreas.negative
				&&	newItem.scanData.actualTriggerArea 	=== DeviceDataManagerServiceConstant.triggerAreas.positive  
			) { 
				DeviceDataManagerChannel.pubEnteredTriggerArea(newItem); 
				return;
			}
			
			// positive -> negative
			else if( 	newItem.scanData.lastTriggerArea 	=== DeviceDataManagerServiceConstant.triggerAreas.positive
					&&	newItem.scanData.actualTriggerArea 	=== DeviceDataManagerServiceConstant.triggerAreas.negative  ) 
			{ 
				DeviceDataManagerChannel.pubExitTriggerArea(newItem);
				return;
			}

   		}

   		
   		
     	 
     	  
     	  
          /**
  		 * getItemWithDefaultData
  		 * 
  		 * generates a new item with default scan and bcmsBeacon data.
  		 * This function is used if we initially add a item to knownDevicesList
  		 * 
  		 * @param bcmsBeaconKey {String} bcmsBeaconKey of device ([iBeaconUUID].[major].[minor])
  		 * 
  		 * @return new item with scanData and bcmsData
  		 */
  		function getItemWithDefaultData(bcmsBeaconKey) {

  			var prepatedItem = {
  					bcmsBeacon : {},
  					scanData   : {}
  			};
  			
  			if(bcmsBeaconKey) {
  				prepatedItem.bcmsBeaconKey = bcmsBeaconKey;
  				prepatedItem.scanData.bcmsBeaconKey = bcmsBeaconKey;
  			}

  			return prepatedItem;
  		}    	 
	     
	};
	
	
	
	
})();