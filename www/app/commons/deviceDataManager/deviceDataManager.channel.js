;(function() {
	'use strict';

	/**
	 * deviceDataManager Module
	 */
	angular.module('commons.deviceDataManager.channel', ['commons.deviceDataManagerChannel.constant', 'commons.baseChannel'])
		   .factory('DeviceDataManagerChannel', DeviceDataManagerChannel);

	
	/**
	 * Manually identify dependencies for minification-safe code
	 * 
	 **/
	DeviceDataManagerChannel.$inject = [ 'BaseChannel', 'DeviceDataManagerChannelConstant' ];
	
	/**
	 * DeviceDataManagerChannel
	**/
	/** @ngInject */
	function DeviceDataManagerChannel(BaseChannel, DeviceDataManagerChannelConstant) {
	
		//setup and return service            	
        var deviceDataManagerChannel = {
        		
        	   subKnownDeviceUpdated 		: subKnownDeviceUpdated,
          	   pubKnownDeviceUpdated		: pubKnownDeviceUpdated,
          	   
          	   subKnownDevicesUpdated 		: subKnownDevicesUpdated,
          	   pubKnownDevicesUpdated		: pubKnownDevicesUpdated,
          	   
          	   subEnteredTriggerArea 		: subEnteredTriggerArea,
          	   pubEnteredTriggerArea 		: pubEnteredTriggerArea,
          	   
          	   subExitedTriggerArea 			: subExitedTriggerArea,
          	   pubExitedTriggerArea 			: pubExitedTriggerArea
          	   
    		
    		
        };
        
        return deviceDataManagerChannel;

        ////////////
        
        //@TODO add documentation
        
        // publish knownDevices updated notification
        function pubKnownDeviceUpdated(knownDeviceKey) {
        	BaseChannel.pubRootEmit(DeviceDataManagerChannelConstant.bleDeviceUpdates, {knownDeviceKey : knownDeviceKey});
        };
        // subscribe to knownDevices updated notification
        function subKnownDeviceUpdated($scope, scopeHandler) {
     	   //console.log('subKnownDeviceUpdated');
     	   BaseChannel.subRootEmit(DeviceDataManagerChannelConstant.bleDeviceUpdates, $scope, scopeHandler, function(args) { return args.knownDeviceKey; });
        };
        
        // publish knownDevices updated notification
        function pubKnownDevicesUpdated(knownDeviceKeys) {
     	   BaseChannel.pubRootEmit(DeviceDataManagerChannelConstant.bleDevicesUpdates, {knownDeviceKeys : knownDeviceKeys});
        };
        // subscribe to knownDevices updated notification
        function subKnownDevicesUpdated($scope, scopeHandler) {
     	   //console.log('subKnownDevicesUpdated');
     	   BaseChannel.subRootEmit(DeviceDataManagerChannelConstant.bleDevicesUpdates, $scope, scopeHandler, function(args) { return args.knownDeviceKeys; });
        };

        // publish knownDevices updated notification
        function pubEnteredTriggerArea(device) {
     	   BaseChannel.pubRootEmit(DeviceDataManagerChannelConstant.enteredTriggerArea, {device : device});
        };
        // subscribe to knownDevices updated notification
        function subEnteredTriggerArea($scope, scopeHandler) {
     	   //console.log('subEnteredTriggerArea');
     	   BaseChannel.subRootEmit(DeviceDataManagerChannelConstant.enteredTriggerArea, $scope, scopeHandler, function(args) { return args.device; });
        };
        
        // publish knownDevices updated notification
        function pubExitedTriggerArea(device) {
     	   BaseChannel.pubRootEmit(DeviceDataManagerChannelConstant.exitedTriggerArea, {device : device});
        };
        // subscribe to knownDevices updated notification
        function subExitedTriggerArea($scope, scopeHandler) {
     	   //console.log('subExitedTriggerArea');
     	   BaseChannel.subRootEmit(DeviceDataManagerChannelConstant.exitedTriggerArea, $scope, scopeHandler, function(args) { return args.device; });
        };

      
	};

})();