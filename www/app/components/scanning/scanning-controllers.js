/* Controllers of start component */
//______________________________________________________________________________________

var scanningControllers = angular.module('scanning.controllers', ['bleServices', 'bcmsServices', 'LocalForageModule', 'ngCordova']);



scanningControllers
/**/
.constant("scanningControllersConfig", {
	
	iabOpenVibratePattern : [100, 100, 100],

	iabDefaultSettings 		:  {
		      location		: 'no',
		      clearcache	: 'no',
		      toolbar		: 'no'
		    }
})

/* Scanning Controllers */
scanningControllers.controller( 'ScanningRecentlyseenCtrl', 
				//@TODO check dependncies because if order changes problem occours
				['$dummyScanner', '$rootScope', '$scope', '$filter', 'scanningControllersConfig', 'bleNotificationChannel', 'bcmsAjaxServiceConfig', 'bleDeviceServiceConfig', 'bleDeviceService', '$ionicPlatform', '$cordovaNetwork', '$cordovaInAppBrowser', '$cordovaVibration',
         function($dummyScanner,   $rootScope ,  $scope,   $filter,   scanningControllersConfig,   bleNotificationChannel,   bcmsAjaxServiceConfig,   bleDeviceServiceConfig,   bleDeviceService,   $ionicPlatform,   $cordovaNetwork,   $cordovaInAppBrowser,   $cordovaVibration) {
		
					/**/
					$scope.offset 		= 3000,
					$scope.delay 		= 1000,
					$scope.stepBreak 	= 1000;
					
					$scope.allInOut = function(offset, delay,stepBreak) {
						$dummyScanner.nearFarIntermediateBeaconEntersNagativeAndExiteAlleOneTime(offset, delay,stepBreak);
					};
					
					$scope.nearPositiveInOut = function(delay,stepBreak) {
						console.log($scope.stepBreak); 
						$dummyScanner.nearBeaconEntersPositiveAndExit(delay,stepBreak);	
					}
					
					$scope.nearInOut = function(delay,stepBreak) {
						console.log($scope.stepBreak); 
						$dummyScanner.nearBeaconEntersNagativeAndExiteOneTime(delay,stepBreak);
					}
					
					$scope.intermediateInOut = function(delay,stepBreak) {
						$dummyScanner.intermediateBeaconEntersNagativeAndExiteOneTime(delay,stepBreak);
					};
					
					$scope.farInOut = function(delay,stepBreak) {
						$dummyScanner.farBeaconEntersNagativeAndExiteOneTime(delay,stepBreak);
					}
					
					$scope.startDummyScanning = function() {
						$dummyScanner.startDummyDeviceFoundLoopWithSetInterval();
					};
					
					$scope.stopDummyScanning = function() {
						$dummyScanner.stopDummyDeviceFoundLoopWithSetInterval();
					};


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
   				 
   				 $scope.receivedDevicesList[key] 			= updatedItem; 
   				 $scope.$apply();
    			}
    			
    			
    			
    			handleSituation(updatedItem);
			
    		};

		};
		
      	//initial stuff 
      	var init = function () {
      		//console.log('init'); 
      		bcmsBeaconKeyToObj = $filter('bcmsBeaconKeyToObj');
      		
    		$scope.msBeforeBeaconIsOld = scanningControllersConfig.msBeforeBeaconIsOld
      		
			bleNotificationChannel.onKnownDeviceUpdated($scope, onKnownDeviceUpdatedHandler );
	        
	        $rootScope.$on('$cordovaInAppBrowser:exit', function(e, event){
	    		//console.log('APPTEST: on $cordovaInAppBrowser:exit'); 
	    		$rootScope.iabIsOpen  = false;
	    		
	    		//start all loops
	    		$scope.startBleScanning('$cordovaInAppBrowser:exit');
				$scope.refreshServerData('$cordovaInAppBrowser:exit');
				
	    	});

      	}
      	
    	$scope.openIAB = function(bcmsBeaconKey) {
    		//console.log('APPTEST: openIab with: ' + bcmsBeaconKey); 
    		var device = $scope.receivedDevicesList[bcmsBeaconKey];
    		
    		if(device) {
    			if(device.bcmsBeacon) {
    				if(device.bcmsBeacon.contentTitle == false) {
    					//console.log('APPTEST: no connected content given'); 
    					return;
    				}
    			}
    		}
    		
    		$ionicPlatform.ready(function() {
    			//if offline
    			if($cordovaNetwork.isOffline()) {
    				$scope.alertEnsureInetConnection(true);
    				return;
    			}
    				
    			//if is open
    			if($rootScope.iabIsOpen) {
    				console.log('APPTEST: iabIsOpen'); 
    				return;
    			} 
    			
				var pathToBcms = bcmsAjaxServiceConfig.basePath +'/'+ bcmsAjaxServiceConfig.iabView +'/'+ bcmsBeaconKey+'?ajax=1';
				
				$rootScope.iabIsOpen = true;
				//stop all loops
				$scope.stopBleScanning('openIAB');
	    		
	    		//vibrate for content
    			$cordovaVibration.cancelVibration();
    			$cordovaVibration.vibrateWithPattern(scanningControllersConfig.iabOpenVibratePattern);
	    		
	    		//open iab with beacon content url
    			$cordovaInAppBrowser
    			    .open(pathToBcms, '_blank', scanningControllersConfig.iabDefaultSettings)
    			    .then(
    			    	// success	
    			    	function(event) {
    			    		//console.log('APPTEST: on $cordovaInAppBrowser:open'); 
	    			    }, 
	    			    // error
	    			    function(event) {
	    			    	//start all loops
	    		    		$scope.startBleScanning('openIAB error');
	    					
	    					$rootScope.iabIsOpen = false;
	    			    });
    		 	});
    	}
    	
    	
    	
		init(); 

}]);

