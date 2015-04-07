/* Controllers of start component */
//______________________________________________________________________________________

var scanningControllers = angular.module('scanning.controllers', ['bleServices', 'bcmsServices', 'ngCordova']);



scanningControllers
/**/
.constant("scanningControllersConfig", {
	
	iabOpenVibratePattern : [100, 100, 100],
	iabOpenVibrateTime : 100,

	iabDefaultSettings 		:  {
		      location		: 'no',
		      clearcache	: 'no',
		      toolbar		: 'no'
		    }
})

/* Scanning Controllers */
scanningControllers.controller( 'ScanningRecentlyseenCtrl', 
				//@TODO check dependncies because if order changes problem occours
				['$dummyScanner', '$rootScope', '$scope', '$filter', 'scanningControllersConfig', 'bleNotificationChannel', 'bcmsAjaxServiceConfig', '$cordovaEvothingsBLE', 'bleDeviceServiceConfig', 'bleDeviceService', '$ionicPlatform', '$cordovaNetwork', '$cordovaInAppBrowser', '$cordovaVibration',
         function($dummyScanner,   $rootScope ,  $scope,   $filter,   scanningControllersConfig,   bleNotificationChannel,   bcmsAjaxServiceConfig,   $cordovaEvothingsBLE,   bleDeviceServiceConfig,   bleDeviceService,   $ionicPlatform,   $cordovaNetwork,   $cordovaInAppBrowser,   $cordovaVibration) {
		
					$scope.offset 		= 3000,
					$scope.delay 		= 1000,
					$scope.stepBreak 	= 1000;
					$scope.platforms 	= $dummyScanner.getPlatformTypes();
					$scope.fakePlatform = 'IOS';
					
					$scope.iBeaconRanges = $cordovaEvothingsBLE.getIBeaconRanges();
					
					$scope.setPlatform = function(platform) {
						$dummyScanner.setFakePlatform(platform);
					}
					
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
    			if( $cordovaNetwork.isOffline() ) {
    				$scope.alertEnsureInetConnection(true);
    				return;
    			}
    				
    			//if is open
    			if($rootScope.iabIsOpen) {
    				console.log('APPTEST: iabIsOpen'); 
    				return;
    			} 
    			
    			var pathToContent = bcmsAjaxServiceConfig.basePath +'/'+ bcmsAjaxServiceConfig.iabView +'/'+ bcmsBeaconKey+'?ajax=1';
    			
    			if(device.bcmsBeacon.thirdPartyWebsite) {
    				pathToContent = device.bcmsBeacon.thirdPartyWebsite;
    			}
    	
				
				$rootScope.iabIsOpen = true;
				//stop all loops
				$scope.stopBleScanning('openIAB');
	    		
	    		//vibrate for content
    			//$cordovaVibration.cancelVibration();
    			$cordovaVibration.vibrate(scanningControllersConfig.iabOpenVibrateTime);
	    		
	    		//open iab with beacon content url
    			$cordovaInAppBrowser
    			    .open(pathToContent, '_blank', scanningControllersConfig.iabDefaultSettings)
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
    	   		
    		$rootScope.$on('$cordovaInAppBrowser:loadstop', function(e, event){
    		    // insert Javascript via code / file
    		    $cordovaInAppBrowser.executeScript({
    		    	code: 
    		    	   "var link_buttonText = document.createTextNode('Scan for new content');\
    		    		var link_button = document.createElement('a');\
    		    		link_button.setAttribute('onclick', \"window.close();\");\
    		    		link_button.setAttribute('href', '/close-iab');\
    			    	link_button.id = 'iba-close-button';\
    		    		link_button.style.fontSize = '14px';\
    		    		link_button.style.textDecoration = 'none';\
    		    		link_button.style.color = '#fff';\
    		    		link_button.style.lineHeight = '20px';\
    		    		link_button.style.textAlign	= 'center';\
    		    		link_button.style.verticalAlign = 'middle';\
    		    		link_button.style.backgroundColor = '#ef473a';\
    		    		link_button.style.margin = '0px';\
    		    		link_button.style.padding = '12px';\
    		    		link_button.style.display = 'block';\
    		    		link_button.appendChild(link_buttonText);\
    		    		var footer = document.createElement('div');\
    		    		footer.style.position = 'fixed';\
    		    		footer.style.bottom = 0;\
    		    		footer.style.left = 0;\
    		    		footer.style.right = 0;\
    		    		footer.style.zIndex = 2147483647;\
    		    		footer.appendChild(link_button);\
    		    		document.body.style.marginBottom = '45px';\
    		    		document.body.appendChild(footer);"
    		    })
    		    .then(
    		    	//success
    		    	function() {},
    		    	//error
    		    	function() {}
    		    );
    		  });
    		
    		$rootScope.$on('$cordovaInAppBrowser:loadstart', function(e, event){
    			var url = event.url;
    			if (url.indexOf("close-iab") != -1) { $cordovaInAppBrowser.close();  } 
    		});
    	
    	}
    	
    	/*
    	//http://callmenick.com/post/jquery-functions-javascript-equivalents
    	var getIABFooter = function() {
    	
    		var code = 
    		'var buttonText = document.createTextNode("Close window");\
    		var button = document.createElement("button");\
    		link_button 	button.id = "iba-close-button";\
    		button.style.fontFamily	= "\"Helvetica Neue",​Helvetica,​Arial,​sans-serif\"";\
    		button.style.fontSize = "14px";\
    		button.style.color = "#fff";\
    		button.style.lineHeight = "20px";\
    		button.style.textAlign	= "center";\
    		button.style.verticalAlign = "middle";\
    		button.style.backgroundColor = "#ef473a";\
    		button.style.margin = "0px";\
    		button.style.padding = "6px 12px 6px 12px";\
    		button.style.display = "block";\
    		button.appendChild(buttonText);\
    		var footer = document.createElement("div");\
    		footer.style.position = "fixed";\
    		footer.style.bottom = 0;\
    		footer.style.left = 0;\
    		footer.style.right = 0;\
    		footer.style.zIndex = 2147483647;\
    		footer.appendChild(button);\
    		var body = document.getElementsByTagName("body");\
    		document.body.appendChild(footer);\
	    	var btn=document.querySelector("#iab-close");\
	    	btn.style.backgroundColor = "red";\
	    	btn.setAttribute("onclick", "window.close();")';

    		return footer;
    	}*/
    
		init(); 

}]);