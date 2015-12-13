;(function() {
	'use strict';

	/**
	 * NotificationChannel Module
	 */
	angular.module('commons.services.scannLogger.factory', ['ngCordova', 'ngDrupal7Services-3_x.resources.node.resource', 'ngDrupal7Services-3_x.commons.helperService', 'commons.services.ble.bleChannels', 'commons.deviceDataManager.channel', 'commons.deviceDataManager.service'])
		   .factory('ScannLogger', ScannLogger); 

	ScannLogger.$inject = ['$rootScope','$state','$filter','$ionicPlatform','DeviceDataManagerChannel','DeviceDataManagerService','NodeResource', 'DrupalHelperService', 'bleScannerChannel'];
	
	function ScannLogger(  $rootScope,  $state,  $filter,   $ionicPlatform, DeviceDataManagerChannel,   DeviceDataManagerService,  NodeResource,   DrupalHelperService,    bleScannerChannel) {
		
		var configurations = {};
		
		//
		var scope = $rootScope.$new(),
			measurementData = [],
			ScannLoggerService = {
			start: start,
			stop : stop,
			save : save,
			getConfig : getConfig,
			setConfig : setConfig
		};
		
        return ScannLoggerService;

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
    		var newDevice =  DeviceDataManagerService.getKnownDevice(preparedDevice.bcmsBeaconKey);
    		console.log(newDevice.scanData.lastScan); 
    		//measurementData[newDevice.scanData.lastScan] = newDevice;
    	
		};
        
        function stop() {
        	
        }
        
        function save() {
        	//console.log('we try to save now'); 
        	
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