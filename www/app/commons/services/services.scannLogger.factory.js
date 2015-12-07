;(function() {
	'use strict';

	/**
	 * NotificationChannel Module
	 */
	angular.module('commons.services.scannLogger.factory', ['ngCordova', 'ngDrupal7Services-3_x.resources.node.resource', 'ngDrupal7Services-3_x.commons.helperService', 'commons.services.ble.bleChannels', 'deviceManagers'])
		   .factory('scannLogger', scannLogger); 

	/**
	 * Manually identify dependencies for minification-safe code
	 * 
	 **/
	scannLogger.$inject = ['$rootScope','$state','$filter','$ionicPlatform','bleDeviceChannel','bleDeviceService','NodeResource', 'DrupalHelperService', 'bleScannerChannel', 'bleDeviceService'];
	
	/**
	 * The function holds the logic for local notifications
	 * 
	 **/
	function scannLogger(  $rootScope,  $state,  $filter,   $ionicPlatform, bleDeviceChannel,   bleDeviceService,  NodeResource,   DrupalHelperService,    bleScannerChannel,  bleDeviceService) {
		
		var configurations = {};
		
		//
		var scope = $rootScope.$new(),
			measurementData = [],
			NotificationChannelService = {
			start: start,
			stop : stop,
			save : save,
			getConfig : getConfig,
			setConfig : setConfig
		};
		
        return NotificationChannelService;

        ////////////
      
        /**
         * setConfig
         * @TODO extend with checks
         * 
         * @param data {Object} json with key and value of new measurement data
         * 
         * @return {Boolean}
         */
        function setConfig(settings) {
        	configurations	= settings;
        }
        
        function getConfig() {
        	return configurations;
        }

        function start() {
	      	bleScannerChannel.onFoundBleDevice($scope, onFoundDeviceHandler);
        }
        
        //this is used to update list after serverdata updated   	
    	function onFoundDeviceHandler(preparedDevice) { 
    		var newDevice =  bleDeviceService.getKnownDevice(preparedDevice.bcmsBeaconKey);
    		console.log(newDevice.scanData.lastScan); 
    		//measurementData[newDevice.scanData.lastScan] = newDevice;
    	
		};
        
       
        
        function stop() {
        	
        }
        
        function save() {
        	console.log('we try to save now'); 
        	
        	var newMeasurement = {
					        		title : 'configurations.title',
					        		type : 'messdaten',
					        		body  : DrupalHelperService.structureField(measurementData, 'value')
					        	};
        	
        	
        	
        	console.log(configurations);
        	
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