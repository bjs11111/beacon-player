;(function() {
    'use strict';

    /**
	 *  Constants for AdvertisingDataChannel
	 *
	 *  NOTE: if you want to change this constant do this in a config section of angular
	 */
	var AdvertisingDataChannelConstant =  {

 		// Get variable action
 		retrieveConfirmed	: 'event:drupal-advertisingData-retrieveConfirmed',
    retrieveFailed  	: 'event:drupal-advertisingData-retrieveFailed',
    // create action
    createConfirmed	: 'event:drupal-advertisingData-createConfirmed',
    createFailed  	: 'event:drupal-advertisingData-createFailed',
	};

	/**
	 * AdvertisingData Channel Constant
	 */
	angular
	    .module('commons.resources.advertisingData.channelConstant', [])
	    .constant("AdvertisingDataChannelConstant", AdvertisingDataChannelConstant);

})();
