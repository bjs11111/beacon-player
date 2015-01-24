/* Controllers of start component */
//______________________________________________________________________________________

var scanningControllers = angular.module('scanning.controllers', ['bleServices', 'bcmsServices', 'LocalForageModule', 'ngCordova']);



scanningControllers
/**/
.constant("scanningControllersConfig", {
	msBeforeBeaconIsOld : 1000 * 10,
	iabOpenVibratePattern : [100, 100, 100],
	iabDefaultSettings :  {
		      location: 'no',
		      clearcache: 'no',
		      toolbar: 'no'
		    }
})

/*configs*/
.config(function($cordovaInAppBrowserProvider) {

	  var defaultOptions = {
	    location: 'yes',
	    clearcache: 'yes',
	    toolbar: 'yes'
	  };

	  //document.addEventListener(function () {
	  //  $cordovaInAppBrowserProvider.setDefaultOptions(options)
	  //}, false);
	  
	});
/* Scanning Controllers */

scanningControllers.controller( 'ScanningRecentlyseenCtrl', 
				['$rootScope', '$scope', '$filter', 'scanningControllersConfig', '$cordovaEvothingsBLE', 'bcmsNotificationChannel', 'bleNotificationChannel',  '$localForage', 'bcmsAjaxServiceConfig', '$ionicPlatform', '$cordovaBLE', '$cordovaNetwork', '$cordovaInAppBrowser', '$cordovaVibration',
         function($rootScope ,  $scope,   $filter,   scanningControllersConfig,   $cordovaEvothingsBLE,   bcmsNotificationChannel,   bleNotificationChannel,    $localForage,   bcmsAjaxServiceConfig,   $ionicPlatform,   $cordovaBLE,   $cordovaNetwork,   $cordovaInAppBrowser,   $cordovaVibration) {
		
		//beacon removes after 5 minutes
		var cmsBeaconKeyToObj = null;
      	//prevent multiple iab openings
		$scope.iabAlreadyTriggered = false;
		
		//this keeps the device list up to date      	
    	var onKnownDevicesUpdatedHandler = function()  {
    		var count = 0;
    		$localForage.iterate(function(value, key) {
    			if(cmsBeaconKeyToObj(key) != false) { 
    				
    				delete $scope.list[key];
    				//@TODO remove item that lastScan is more than 5 min ago
    				if(value.scanData && value.bcmsBeacon ) {
    			
    					if(value.scanData.lastScan > Date.now()-scanningControllersConfig.msBeforeBeaconIsOld) {
    						$scope.list[key] = value;
    						count++;
    					}
       				}
    			};
    		})
    		.then(function(data) {});
			
		};
		
		//      	
    	var onDeviceTriggeredHandler = function(bcmsBeaconKey)  {
    		//console.log('oiaf path1: '+bcmsBeaconKey); 
    		//ignor trigger of beacon with no content
    		
    		//@TODO fattening the  pyramide!
    		if($scope.list[bcmsBeaconKey]) {
    			if($scope.list[bcmsBeaconKey].bcmsBeacon) {
    				if(!$scope.list[bcmsBeaconKey].bcmsBeacon.content_title) {
    						return;
    				}
    			}
    		}
    		
    		if($cordovaNetwork.isOffline()) {
				return;
			}
    		
    		if(!$scope.iabAlreadyTriggered) {
        		 bcmsNotificationChannel.publishTryOpenIAB(bcmsBeaconKey);
    		}
    		
		};

      	//initial stuff 
      	var init = function () {
      		cmsBeaconKeyToObj = $filter('cmsBeaconKeyToObj');
	      	$scope.list = {};
			//
			bleNotificationChannel.onKnownDevicesUpdated($scope, onKnownDevicesUpdatedHandler); 
			bleNotificationChannel.onDeviceTriggered($scope, onDeviceTriggeredHandler); 
			bcmsNotificationChannel.onTryOpenIAB($scope, function(bcmsBeaconKey) { openIAB(bcmsBeaconKey); }); 
			onKnownDevicesUpdatedHandler();
      	}

    	var openIAB = function(bcmsBeaconKey) {
    		
    		 $ionicPlatform.ready(function() { 
    			 
    			 //@TODO think about moveing this into isOnline
    			 $scope.iabAlreadyTriggered = true;
    			
    			 if($cordovaNetwork.isOnline()) {
    				var pathToBcms = bcmsAjaxServiceConfig.basePath +'/'+ bcmsAjaxServiceConfig.iabView +'/'+ bcmsBeaconKey+'?ajax=1';
    				
    				//stop all loops
    				$scope.stopBleScanning('openIAB')
					$scope.stopRefreshingLoop('openIAB');
		    		$rootScope.iabIsOpen = 1;
		    		//check if this is necessary
		    		$rootScope.$apply();
		    		
		    		//vibrate for content
	    			//$cordovaVibration.cancelVibration();
	    			$cordovaVibration.vibrateWithPattern(scanningControllersConfig.iabOpenVibratePattern);
		    		
		    		//open iab with beacon content url
	    			$cordovaInAppBrowser
	    			    .open(pathToBcms, '_blank', scanningControllersConfig.iabDefaultSettings)
	    			    .then(function(event) {
	    			    		// success
	    			    		console.log('APPTEST: on $cordovaInAppBrowser:open'); 
	    			    		
		    			    }, function(event) {
		    			    	// error
		    			    	//start all loops
		    		    		$scope.startBleScanning('openIAB error');
		    					$scope.startRefreshingLoop('openIAB error');
		    					
		    					$rootScope.iabIsOpen = 0;
		    					
		    			    });
    		 	}
    			//if offline
    			else {
    				$scope.alertEnsureInetConnection(true);
    			}
    			 
    		});
    	 }
    	
    	
    	$rootScope.$on('$cordovaInAppBrowser:exit', function(e, event){
    		console.log('APPTEST: on $cordovaInAppBrowser:exit'); 
    		$rootScope.iabIsOpen = 0;
    		
    		//start all loops
    		$scope.startBleScanning('$cordovaInAppBrowser:exit');
			$scope.startRefreshingLoop('$cordovaInAppBrowser:exit');
			
    	  });
    	
    	
   		$scope.getListLength = function() {
			var i = 0;
			angular.forEach($scope.list, function(value, key) { i++; });
			return i;
		};
    	
		init(); 

}]);

