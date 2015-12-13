;(function() {
    'use strict';

    /**
	 *  Constants for deviceDataManagerChannel 
	 *  
	 *  NOTE: if you want to change this constant do this in your app.js config section
	**/
   
    //setup constant
    var	deviceDataManagerChannelConstant =  {
    		//events
    		bleDeviceUpdates	: 'bleDeviceUpdates',
    		bleDevicesUpdates 	: 'bleDevicesUpdates',
    		
    		enteredTriggerArea 	: 'enteredTriggerArea',
    		exitTriggerArea 	: 'exitTriggerArea'
	};
    
  	/**
	 * deviceDataManager constant
	**/
	angular
	    .module('commons.deviceDataManagerChannel.constant', [])
	    .constant("DeviceDataManagerChannelConstant", deviceDataManagerChannelConstant);

})();