;(function() {
	'use strict';

	/**
	 * NotificationChannel Module
	 */
	angular.module('commons.services.scannLogger.factory', ['ngCordova', 'ngDrupal7Services-3_x.resources.node.resource', 'ngDrupal7Services-3_x.commons.helperService', 'commons.services.ble.bleChannels', 'commons.deviceDataManager.channel', 'commons.deviceDataManager.service'])
		   .factory('ScannLogger', ScannLogger); 

	ScannLogger.$inject = ['$rootScope','$state','$filter','$ionicPlatform','NodeResource','DrupalHelperService','bleScannerChannel'];
	
	function ScannLogger(   $rootScope,  $state,  $filter,  $ionicPlatform,  NodeResource,  DrupalHelperService,  bleScannerChannel) {
		
		var configurations = {
				devideInformation		: true,
				gpsPosition 			: true,
				appState				: true
			},
			
			deviceInformation = undefined,
			isOffline 		  = false,
			isBackground 	  = false,
			
			scope = $rootScope.$new(),
			unsubFoundDevice,
			measurementData = {},
			packagesCount = 0;
			
		var	ScannLoggerService = {
			start: start,
			stop : stop,
			save : save,
			packagesCount : packagesCount,
			getConfig : getConfig,
			setConfig : setConfig
		};
		
		init();
		
        return ScannLoggerService;

        ////////////
        
         function init() {
        	 //updateDeviceInformation
        	 ionic.Platform.ready(function(){
    		     // will execute when device is ready, or immediately if the device is already ready.
    		 	 deviceInformation = ionic.Platform.device();
        	 });
        	 
        	//online offline
        	 $rootScope.$on('$cordovaNetwork:online', function(event, networkState){ isOffline = false;});
     	     $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){ isOffline = true;});

     	     //open/background
     	     $ionicPlatform.on('pause', function(event){ isBackground = true;});
     	     $ionicPlatform.on('resume', function(event){ isBackground = false;});
     	     //$ionicPlatform.on('volumedownbutton', function(event){volumedownbutton = true;});
     	     //$ionicPlatform.on('batterylow', function(event){batterylow = true;});
     	     //$ionicPlatform.on('offline', function(event){offline = true;});
         };
         
         
         
      
        /**
         * setConfig
         * @TODO extend with checks
         * 
         * @param data {Object} json with key and value of new measurement data
         * 
         * @return {Boolean}
         */
        function setConfig(settingsOrKey, value) {
        	if(angular.isString(settingsOrKey)) {
        		configurations[settingsOrKey] = value;
        	}
        	else {
        		configurations	= settingsOrKey;
        	}
        }
        
        function getConfig(key) {
        	if(key) {
        		return configurations.key;
        	}
        	
        	return configurations;
        }

        function start() {
        	if(!unsubFoundDevice) {
        		unsubFoundDevice = bleScannerChannel.onFoundBleDevice(scope, onFoundDeviceHandler);
        	}
	      	
        }
        
        //every measurement focused on ble advertising packages	
        //depending on config obj we add additional data to it
    	function onFoundDeviceHandler(preparedDevice) { 
    		ScannLoggerService.packagesCount++;
    		
    		var newData =  {};
    	
    		newData.deviceInformation = deviceInformation;
    		newData.isOffline = isOffline;
    		newData.isBackground = isBackground;
    		//newData.gpsPosition = gpsPosition;
    		newData.blePackage = preparedDevice;
    		console.log(newData); 
    		
    		measurementData[newData.blePackage.lastScan] = newData;
		};
        
        function stop() {
        	if(unsubFoundDevice) {
        		unsubFoundDevice();
        	} 	
        }
        
        function save() {
        	console.log('we try to save now'); 
        	
        	var newMeasurement = {
					        		title 	: 'configurations.title',
					        		type 	: 'messdaten',
					        		body  	: DrupalHelperService.structureField({ value : [JSON.stringify(measurementData)], format: "plain_text"})
					        	};
             
        	
        	console.log(newMeasurement);
        	NodeResource
        		.create(newMeasurement)
        			.then(	function(data) {
		        				console.log(data); 
		        			},
		        			function(error) {
		        				console.log(error); 
		        			}
        			);
        }
        
        
		
	};

})();