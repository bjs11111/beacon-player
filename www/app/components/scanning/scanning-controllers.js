/* Controllers of start component */
var scanningControllers = angular.module('scanningControllers', ['bleChannels']);


/*Config for scanning controllers*/
scanningControllers.constant("scanningCtrlConfig", {
	
	iabOpenVibratePattern : [100, 100, 100],
	iabOpenVibrateTime : 100,

	iabDefaultSettings 		:  {
		      location		: 'no',
		      clearcache	: 'no',
		      toolbar		: 'no'
		    }
});

/*Scanning controller*/
scanningControllers.controller('scanningCtrl', 
				[ '$scope', 'bleScannerChannel', 
        function(  $scope,   bleScannerChannel) {
		
		$scope.receivedDevicesList = {}; 
		$scope.listLength = 0;
					
		bleScannerChannel.onFoundBleDevice($scope, 
				function(device) {  console.log('BLE: onFoundBleDevice:' + JSON.stringify(device)); }
		);

		//this is used to update after serverdata updated   	
    	var onKnownDeviceUpdatedHandler = function(key)  {
    		 
    	
    		
			//console.log('in onKnownDeviceUpdatedHandler');
			
			
			
			key = (key)?key:false;
			if (!key) { return; }
			
    		if(bcmsBeaconKeyToObj(key) != false) {

    			var newItem 	= bleDeviceService.getKnownDevice(key);
    			
    			//just update scanned and registred devices
    			if(!newItem.scanData || !newItem.bcmsBeacon) { return; }	
    			
    			var currentItem = $scope.receivedDevicesList[key];
    				currentItem = (currentItem)? currentItem : false;
    			//a new reference
    			var updatedItem = {};
    			
    			//item is not in list 
    			//add item to list
    			if(!currentItem) {
    					updatedItem  = angular.extend({}, updatedItem, newItem);
    					
    					//add triggerhandling values
    					updatedItem.scanData.alreadyTriggered 	= false;
    					updatedItem.scanData.lastTriggerArea 	= bleDeviceServiceConfig.triggerAreas.outOfRange;
    					updatedItem.scanData.actualTriggerArea 	= bleDeviceService.calculateActualTriggerArea(updatedItem);	
    					updatedItem.scanData.lastRssiValue		= -100;
    					
    					$scope.receivedDevicesList[key] 		= updatedItem;
    					
    					$scope.updateListLength();
    					$scope.$apply();
    			}
    			//update
    			else {
   				 updatedItem  = angular.extend({}, currentItem, newItem);
   				 
				 updatedItem.scanData.alreadyTriggered 		= currentItem.scanData.alreadyTriggered;
				 updatedItem.scanData.lastTriggerArea 		= currentItem.scanData.actualTriggerArea;
   				 updatedItem.scanData.actualTriggerArea 	= bleDeviceService.calculateActualTriggerArea(updatedItem); 
   				 updatedItem.scanData.lastRssiValue			= updatedItem.scanData.rssi;
   				 updatedItem.rssi							= updatedItem.scanData.rssi;
   				 
   				 $scope.receivedDevicesList[key] 			= updatedItem; 
   				 
    			}

    			handleSituation(updatedItem);
			
    		};/**/

		};
	
      	//initial stuff 
      	var init = function () {
      		console.log('BLE: init');  
      		//bcmsBeaconKeyToObj = $filter('bcmsBeaconKeyToObj');     		
    		//$scope.msBeforeBeaconIsOld = scanningCtrlConfig.msBeforeBeaconIsOld
			bleScannerChannel.onFoundBleDevice($scope, onKnownDeviceUpdatedHandler );
      	}	 
		
      	
      	init();
}]);

/* Scanning Controllers 
contentScanningControllers.controller( 'contentScanningCtrl', 
				//@TODO check dependncies because if order changes problem occours
				[ '$rootScope', '$scope', '$filter', 'scanningCtrlConfig', 'bleScannerChannel', 'bcmsAjaxServiceConfig',  'bleDeviceServiceConfig', 'bleDeviceService', '$ionicPlatform', '$cordovaNetwork', '$cordovaInAppBrowser', '$cordovaVibration',
         function( $rootScope ,  $scope,   $filter,   scanningCtrlConfig,   bleScannerChannel,   bcmsAjaxServiceConfig,    bleDeviceServiceConfig,   bleDeviceService,   $ionicPlatform,   $cordovaNetwork,   $cordovaInAppBrowser,   $cordovaVibration) {

		//filter to validate the cmsBeaconKey
	    var bcmsBeaconKeyToObj = null;
		
		var handleSituation = function(deviceData) {
			//console.log('SCANTEST: handleSituation');
			deviceData = (deviceData)?deviceData:false;
			if(!deviceData)return;
			//console.log('SCANTEST: deviceData= ' + JSON.stringify(deviceData) );
		
			//beacon enters list with triggerState positive || beacon updates triggerState from negative to positive 
			//Open just once in the positive area
			if(		deviceData.scanData.lastTriggerArea 	=== bleDeviceServiceConfig.triggerAreas.outOfRange
				&&	deviceData.scanData.actualTriggerArea 	=== bleDeviceServiceConfig.triggerAreas.positive
				|| 	deviceData.scanData.lastTriggerArea 	=== bleDeviceServiceConfig.triggerAreas.negative
				&&	deviceData.scanData.actualTriggerArea 	=== bleDeviceServiceConfig.triggerAreas.positive  ) 
			{ 
				//console.log('SCANTEST: will enter'); 
				if (deviceData.scanData.alreadyTriggered === false) {
					
					if($rootScope.iabIsOpen === false) {
						deviceData.scanData.alreadyTriggered = true;
						$scope.openIAB(deviceData.bcmsBeaconKey);
					}
					else {
						//console.log('SCANTEST: IAB is open. Do not open again!'); 
					}
				}
			}
			//beacon updates triggerState from positive to negative 
			else if( 	deviceData.scanData.lastTriggerArea 	=== bleDeviceServiceConfig.triggerAreas.positive
					&&	deviceData.scanData.actualTriggerArea 	=== bleDeviceServiceConfig.triggerAreas.negative  ) 
			{ 
				//console.log('SCANTEST: will exit'); 
				deviceData.scanData.alreadyTriggered = false;
			}
			//device go into positive when IAB was open
			else if( 	deviceData.scanData.lastTriggerArea 	=== bleDeviceServiceConfig.triggerAreas.positive
					&&	deviceData.scanData.actualTriggerArea 	=== bleDeviceServiceConfig.triggerAreas.positive  ) 
			{ 
					if (deviceData.scanData.alreadyTriggered === false) {
						
						if($rootScope.iabIsOpen === false) {
							deviceData.scanData.alreadyTriggered = true;
							$scope.openIAB(deviceData.bcmsBeaconKey);
						}
						else {
							//console.log('SCANTEST: IAB is open. Do not open again!'); 
						}
					}
			}
			else {
				//console.log('SCANTEST: no situation to handle: ' + deviceData.scanData.lastTriggerArea + '=>' + deviceData.scanData.actualTriggerArea ); 
			}

		}
		
		//this is used to update after serverdata updated   	
    	var onKnownDeviceUpdatedHandler = function(key)  {
			//console.log('in onKnownDeviceUpdatedHandler');
			
			key = (key)?key:false;
			if (!key) { return; }
			
    		if(bcmsBeaconKeyToObj(key) != false) {

    			var newItem 	= bleDeviceService.getKnownDevice(key);
    			
    			//just update scanned and registred devices
    			if(!newItem.scanData || !newItem.bcmsBeacon) { return; }	
    			
    			var currentItem = $scope.receivedDevicesList[key];
    				currentItem = (currentItem)? currentItem : false;
    			//a new reference
    			var updatedItem = {};
    			
    			//item is not in list 
    			//add item to list
    			if(!currentItem) {
    					updatedItem  = angular.extend({}, updatedItem, newItem);
    					
    					//add triggerhandling values
    					updatedItem.scanData.alreadyTriggered 	= false;
    					updatedItem.scanData.lastTriggerArea 	= bleDeviceServiceConfig.triggerAreas.outOfRange;
    					updatedItem.scanData.actualTriggerArea 	= bleDeviceService.calculateActualTriggerArea(updatedItem);	
    					updatedItem.scanData.lastRssiValue		= -100;
    					
    					$scope.receivedDevicesList[key] 		= updatedItem;
    					
    					$scope.updateListLength();
    					$scope.$apply();
    			}
    			//update
    			else {
   				 updatedItem  = angular.extend({}, currentItem, newItem);
   				 
				 updatedItem.scanData.alreadyTriggered 		= currentItem.scanData.alreadyTriggered;
				 updatedItem.scanData.lastTriggerArea 		= currentItem.scanData.actualTriggerArea;
   				 updatedItem.scanData.actualTriggerArea 	= bleDeviceService.calculateActualTriggerArea(updatedItem); 
   				 updatedItem.scanData.lastRssiValue			= updatedItem.scanData.rssi;
   				 updatedItem.rssi							= updatedItem.scanData.rssi;
   				 
   				 $scope.receivedDevicesList[key] 			= updatedItem; 
   				 
    			}

    			handleSituation(updatedItem);
			
    		};

		};
	
      	//initial stuff 
      	var init = function () {
      		//console.log('init'); 
      		bcmsBeaconKeyToObj = $filter('bcmsBeaconKeyToObj');     		
    		$scope.msBeforeBeaconIsOld = scanningCtrlConfig.msBeforeBeaconIsOld
			bleScannerChannel.onKnownDeviceUpdated($scope, onKnownDeviceUpdatedHandler );
      	}	
    
		init(); 
		
}]);*/