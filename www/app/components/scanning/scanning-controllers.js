/* Controllers of start component */
//______________________________________________________________________________________

var scanningControllers = angular.module('scanning.controllers', ['bleServices', 'bcmsServices', 'LocalForageModule', 'ngCordova']);



scanningControllers
/**/
.constant("scanningControllersConfig", {
	
	iabOpenVibratePattern : [100, 100, 100],
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
	iabDefaultSettings 		:  {
		      location		: 'no',
		      clearcache	: 'no',
		      toolbar		: 'no'
		    }
})

/* Scanning Controllers */
scanningControllers.controller( 'ScanningRecentlyseenCtrl', 
				['$dummyScanner', '$rootScope', '$scope', '$filter', 'scanningControllersConfig', '$cordovaEvothingsBLE', 'bcmsNotificationChannel', 'bleNotificationChannel',  'bcmsAjaxServiceConfig', 'bleDeviceService', '$ionicPlatform', '$cordovaNetwork', '$cordovaInAppBrowser', '$cordovaVibration',
         function($dummyScanner,   $rootScope ,  $scope,   $filter,   scanningControllersConfig,   $cordovaEvothingsBLE,   bcmsNotificationChannel,   bleNotificationChannel,    bcmsAjaxServiceConfig,   bleDeviceService,   $ionicPlatform,   $cordovaNetwork,   $cordovaInAppBrowser,   $cordovaVibration) {
		
					/**/
					$scope.allInOut = function() {
						$dummyScanner.nearFarIntermediateBeaconEntersAndExiteAlleOneTime();
					};
					
					$scope.nearInOut = function() {
						$dummyScanner.nearBeaconEntersAndExiteOneTime();
					}
					
					$scope.intermediateInOut = function() {
						$dummyScanner.intermediateBeaconEntersAndExiteOneTime();
					};
					
					$scope.farInOut = function() {
						$dummyScanner.farBeaconEntersAndExiteOneTime();
					}
					
					$scope.startDummyScanning = function() {
						$dummyScanner.startDummyDeviceFoundLoopWithSetInterval();
					};
					
					$scope.stopDummyScanning = function() {
						$dummyScanner.stopDummyDeviceFoundLoopWithSetInterval();
					};
					/**/
					
					
					
		var cmsBeaconKeyToObj = null;
		
		var calculateActualTriggerArea = function(deviceData) {
			var ThresholdOffset = undefined;
			var willEntry = undefined;
			
			//detect willEntry value
			//will entry or stay
			if(		deviceData.scanData.lastTriggerArea === scanningControllersConfig.triggerAreas.negative
				||	deviceData.scanData.lastTriggerArea === scanningControllersConfig.triggerAreas.outOfRange ) 
			{ willEntry = true; }
			//will exit or stay
			else if( deviceData.scanData.lastTriggerArea === scanningControllersConfig.triggerAreas.positive ) 
			{ willEntry = false; } 
			
			if(willEntry === undefined) { console.log('willEntry is undefined: ' + deviceData.scanData.lastTriggerArea + '=>' + deviceData.scanData.actualTriggerArea); }
			
			switch(deviceData.bcmsBeacon.triggerZone) {
				case scanningControllersConfig.triggerZones.near.name:
					ThresholdOffset = (willEntry)?scanningControllersConfig.triggerZones.near.entryThresholdOffset:scanningControllersConfig.triggerZones.near.exitThresholdOffset;
				break;
				case scanningControllersConfig.triggerZones.intermediate.name:
					ThresholdOffset = (willEntry)?scanningControllersConfig.triggerZones.intermediate.entryThresholdOffset:scanningControllersConfig.triggerZones.intermediate.exitThresholdOffset;
				break;
				case scanningControllersConfig.triggerZones.far.name:
					ThresholdOffset = (willEntry)?scanningControllersConfig.triggerZones.far.entryThresholdOffset:scanningControllersConfig.triggerZones.far.exitThresholdOffset;
				break;	
			}
			
			if(ThresholdOffset === undefined) { console.log('ThresholdOffset is undefined'); return; }
			
	
			if(deviceData.scanData.rssi > deviceData.scanData.estimatedDistance + ThresholdOffset) 
			{ return scanningControllersConfig.triggerAreas.positive;}
			//stay
			else {return scanningControllersConfig.triggerAreas.negative;}	
			
			

		};
		
		var handleSituation = function(deviceData) {
			console.log('SCANTEST: handleSituation');
			bcmsBeaconKey = (deviceData)?deviceData:false;
			if(!deviceData)return;
			//console.log('SCANTEST: deviceData= ' + JSON.stringify(deviceData) );
		
			//beacon enters list with triggerState positive || beacon updates triggerState from negative to positive 
			//Open just once in the positive area
			if(		deviceData.scanData.lastTriggerArea === scanningControllersConfig.triggerAreas.outOfRange
				&&	deviceData.scanData.actualTriggerArea === scanningControllersConfig.triggerAreas.positive
				|| 	deviceData.scanData.lastTriggerArea === scanningControllersConfig.triggerAreas.negative
				&&	deviceData.scanData.actualTriggerArea === scanningControllersConfig.triggerAreas.positive  ) 
			{ 
				console.log('SCANTEST: will enter'); 
				if (deviceData.scanData.alreadyTriggered === false) {
					deviceData.scanData.alreadyTriggered = true;
					console.log('SCANTEST: before iabIsOpen check');
					if($rootScope.iabIsOpen === false) {
						console.log('SCANTEST: in iabIsOpen check');
						//openIAB(deviceData.bcmsBeaconKey);
					}
					else {
						console.log('SCANTEST: IAB is open do not open again!'); 
					}
				}
			}
			//beacon updates triggerState from positive to negative 
			else if( 	deviceData.scanData.lastTriggerArea === scanningControllersConfig.triggerAreas.positive
					&&	deviceData.scanData.actualTriggerArea === scanningControllersConfig.triggerAreas.negative  ) 
			{ 
				console.log('SCANTEST: will exit'); 
				deviceData.scanData.alreadyTriggered = false;
			} else {
				console.log('SCANTEST: no situation to handle: ' + deviceData.scanData.lastTriggerArea + '=>' + deviceData.scanData.actualTriggerArea ); 
			}

		}
	
		//this is used to update after serverdata updated   	
    	var onKnownDeviceUpdatedHandler = function(key)  {
			//console.log('in onKnownDeviceUpdatedHandler');
			
			key = (key)?key:false;
			if (!key) { return; }
			
    		if(cmsBeaconKeyToObj(key) != false) {

    			var newItem 	= bleDeviceService.getKnownDevice(key);
    			//just update scanned and registred devices
    			if(!newItem.scanData || !newItem.bcmsBeacon) {
    				return;
    			}	
    			
    			var currentItem = $scope.receivedDevicesList[key];
    				currentItem = (currentItem)? currentItem : false;
    			
    				
    			var updatedItem = {};
    			
    			//item is not in list 
    			//add item to list
    			if(!currentItem) {
    					//console.log('add'); 
    					updatedItem  = angular.extend({}, updatedItem, newItem);
    					//add triggerhandling values
    					updatedItem.scanData.alreadyTriggered 	= false;
    					
    					updatedItem.scanData.lastTriggerArea 	= scanningControllersConfig.triggerAreas.outOfRange;
    					updatedItem.scanData.actualTriggerArea 	= calculateActualTriggerArea(updatedItem);	
    					console.log('SCANTEST: add actualTriggerArea= ' + updatedItem.scanData.actualTriggerArea);
    					console.log('SCANTEST: add lastTriggerArea= ' + updatedItem.scanData.lastTriggerArea);
    					updatedItem.scanData.lastRssiValue		= -100;
    					
    					$scope.receivedDevicesList[key] 		= updatedItem;
    				
    					
    					$scope.updateListLength();
    					
    			}
    			//update
    			else {
    				//return;
    				 //console.log('update'); 
    				 updatedItem  = angular.extend({}, currentItem, newItem);
    				 console.log('SCANTEST: update actualTriggerArea= ' + updatedItem.scanData.actualTriggerArea);
 					 console.log('SCANTEST: update lastTriggerArea= ' + updatedItem.scanData.lastTriggerArea);
    				 updatedItem.scanData.lastTriggerArea 		= newItem.scanData.actualTriggerArea;
    				 
    				 updatedItem.scanData.actualTriggerArea 	= calculateActualTriggerArea(updatedItem); 
    				 updatedItem.scanData.lastRssiValue			= updatedItem.scanData.rssi;
    				 
    				 console.log('SCANTEST: update actualTriggerArea= ' + updatedItem.scanData.actualTriggerArea);
 					 console.log('SCANTEST: update lastTriggerArea= ' + updatedItem.scanData.lastTriggerArea);
    				 $scope.receivedDevicesList[key] 			= updatedItem; 
    				 $scope.$apply();
    			}
    			
    			
    			
    			handleSituation(updatedItem);
			
    		};

		};
		
		var onKnownDevicesUpdatedHandler = function()  {
			console.log('in onKnownDevicesUpdatedHandler'); 
			//angular.forEach($scope.receivedDevicesList, function(obj, i){
				 	//consoel.log(obj.bcmsBeaconKey); 
					 //var newItem = bleDeviceService.getKnownDevice(obj.bcmsBeaconKey); 
					// $scope.receivedDevicesList[key] = value;
	    	//}); 
		};
		
		
		$rootScope.$on('$cordovaInAppBrowser:exit', function(e, event){
    		console.log('APPTEST: on $cordovaInAppBrowser:exit'); 
    		$rootScope.iabIsOpen = false;
    		
    		//start all loops
    		$scope.startBleScanning('$cordovaInAppBrowser:exit');
			$scope.refreshServerData('$cordovaInAppBrowser:exit');
			
    	});

		

      	//initial stuff 
      	var init = function () {
      		//console.log('init'); 
      		cmsBeaconKeyToObj = $filter('cmsBeaconKeyToObj');
      		
    		$scope.msBeforeBeaconIsOld = scanningControllersConfig.msBeforeBeaconIsOld
      		
			bleNotificationChannel.onKnownDeviceUpdated($scope, onKnownDeviceUpdatedHandler ); 
	        bleNotificationChannel.onKnownDevicesUpdated($scope, onKnownDevicesUpdatedHandler); 
			bcmsNotificationChannel.onManualOpenIAB($scope, function(bcmsBeaconKey) { openIAB(bcmsBeaconKey); }); 
      	}

    	var openIAB = function(bcmsBeaconKey) {
    		console.log('APPTEST: openIab with: ' + bcmsBeaconKey); 
    		var device = $scope.receivedDevicesList[bcmsBeaconKey];
    		
    		if(device) {
    			if(device.bcmsBeacon) {
    				if(device.bcmsBeacon.contentTitle == false) {
    					console.log('APPTEST: no connected content given'); 
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
    			    		console.log('APPTEST: on $cordovaInAppBrowser:open'); 
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

